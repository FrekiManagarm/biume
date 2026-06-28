"use server";

import { db } from "@/lib/utils/db";
import { getCurrentOrganization } from "./auth.action";
import { advancedReport } from "@/lib/schemas/advancedReport/advancedReport";
import { and, eq } from "drizzle-orm";
import { tasks } from "@trigger.dev/sdk/v3";
import z from "zod";
import { reportReminderTask } from "@/lib/trigger/report-reminder.trigger";

const scheduleReminderSchema = z.object({
  reportId: z.string(),
  reminderDate: z.string(), // ISO date string
  reminderMessage: z.string().optional(),
});

/**
 * Programme un rappel pour un rapport finalisé
 */
export async function scheduleReportReminder(
  data: z.infer<typeof scheduleReminderSchema>,
) {
  try {
    const { reportId, reminderDate, reminderMessage } =
      scheduleReminderSchema.parse(data);

    const organization = await getCurrentOrganization();
    if (!organization) {
      throw new Error("Organization not found");
    }

    // Vérifier que le rapport existe et appartient à l'organisation
    const report = await db.query.advancedReport.findFirst({
      where: and(
        eq(advancedReport.id, reportId),
        eq(advancedReport.createdBy, organization.id),
      ),
      with: {
        patient: {
          columns: {
            name: true,
          },
          with: {
            owner: {
              columns: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      throw new Error("Report not found or unauthorized");
    }

    // Vérifier que le client existe et a un email
    if (!report.patient?.owner?.email) {
      throw new Error(
        "Le client associé à ce rapport n'a pas d'adresse email. Veuillez ajouter une adresse email au client avant de programmer un rappel.",
      );
    }

    // Vérifier que la date du rappel est dans le futur
    const reminderDateTime = new Date(reminderDate);
    const now = new Date();
    if (reminderDateTime <= now) {
      throw new Error("La date du rappel doit être dans le futur");
    }

    // Déclencher la tâche Trigger.dev
    const taskHandle = await reportReminderTask.trigger({
      reportId: report.id,
      organizationId: organization.id,
      organizationName: organization.name,
      clientName: report.patient.owner.name || "Client",
      clientEmail: report.patient.owner.email,
      reportTitle: report.title,
      patientName: report.patient?.name,
      reminderDate: reminderDateTime.toISOString(),
      reminderMessage: reminderMessage || undefined,
    });

    console.log(
      `[Report Reminder Action] Rappel programmé avec l'ID : ${taskHandle.id}`,
    );

    return {
      success: true,
      taskId: taskHandle.id,
      reminderDate: reminderDateTime.toISOString(),
    };
  } catch (error) {
    console.error(
      `[Report Reminder Action] Erreur lors de la programmation du rappel :`,
      error,
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

