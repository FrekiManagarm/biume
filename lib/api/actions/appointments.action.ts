"use server";

import { db } from "@/lib/utils/db";
import { and, eq, or, lte, gte, ne, isNull, sql } from "drizzle-orm";
import { getCurrentOrganization } from "./auth.action";
import { Appointment, appointments, pets, advancedReport } from "@/lib/schemas";
import { sendAppointmentNotificationEmail } from "./email.action";
import { format, startOfDay, endOfDay } from "date-fns";
import { revalidatePath } from "next/cache";

export async function getAppointments() {
  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organization not found");

  const results = await db.query.appointments.findMany({
    where: eq(appointments.organizationId, organization.id),
    with: {
      patient: {
        with: {
          owner: {
            columns: {
              id: true,
              name: true,
              email: true,
              image: true,
              phone: true,
            },
          },
          animal: {
            columns: {
              code: true,
              name: true,
            },
          },
        },
      },
      organization: true,
    },
  });

  return results as Appointment[];
}

/**
 * Vérifie si un créneau horaire chevauche des rendez-vous existants
 * @param beginAt Date de début du rendez-vous
 * @param endAt Date de fin du rendez-vous
 * @param excludeAppointmentId ID du rendez-vous à exclure de la vérification (utile pour les modifications)
 * @returns Liste des rendez-vous en conflit
 */
export async function checkAppointmentConflicts(
  beginAt: Date,
  endAt: Date,
  excludeAppointmentId?: string,
) {
  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organization not found");

  // Un rendez-vous est en conflit si :
  // - Il commence avant la fin du nouveau rendez-vous ET
  // - Il se termine après le début du nouveau rendez-vous
  const conflicts = await db.query.appointments.findMany({
    where: and(
      eq(appointments.organizationId, organization.id),
      // Exclure le rendez-vous en cours de modification
      excludeAppointmentId
        ? ne(appointments.id, excludeAppointmentId)
        : undefined,
      // Vérifier le chevauchement
      or(
        // Le rendez-vous existant commence pendant le nouveau créneau
        and(
          gte(appointments.beginAt, beginAt),
          lte(appointments.beginAt, endAt),
        ),
        // Le rendez-vous existant se termine pendant le nouveau créneau
        and(gte(appointments.endAt, beginAt), lte(appointments.endAt, endAt)),
        // Le rendez-vous existant englobe complètement le nouveau créneau
        and(lte(appointments.beginAt, beginAt), gte(appointments.endAt, endAt)),
      ),
    ),
    with: {
      patient: true,
    },
  });

  return conflicts as Appointment[];
}

/**
 * Crée un nouveau rendez-vous
 */
export async function createAppointment(data: {
  patientId: string;
  beginAt: Date;
  endAt: Date;
  atHome?: boolean;
  note?: string;
  notifyOwner?: boolean;
}) {
  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organization not found");

  // Récupérer les informations du patient avec le propriétaire
  const patient = await db.query.pets.findFirst({
    where: eq(pets.id, data.patientId),
    with: {
      owner: true,
    },
  });

  if (!patient) {
    throw new Error("Patient non trouvé");
  }

  const [newAppointment] = await db
    .insert(appointments)
    .values({
      patientId: data.patientId,
      beginAt: data.beginAt,
      endAt: data.endAt,
      organizationId: organization.id,
      atHome: data.atHome || false,
      note: data.note,
      status: "CREATED",
      createdAt: new Date(),
    })
    .returning();

  // Envoyer l'email de notification si demandé et si le propriétaire a un email
  if (data.notifyOwner && patient.owner?.email) {
    try {
      const duration = Math.round(
        (data.endAt.getTime() - data.beginAt.getTime()) / (1000 * 60),
      );
      const appointmentTime = format(data.beginAt, "HH:mm");

      await sendAppointmentNotificationEmail({
        to: patient.owner.email,
        clientName: patient.owner.name || "Cher client",
        petName: patient.name,
        appointmentDate: data.beginAt,
        appointmentTime,
        duration,
        atHome: data.atHome || false,
        note: data.note,
        organizationName: organization.name || undefined,
      });
    } catch (error) {
      // Ne pas faire échouer la création du rendez-vous si l'email échoue
      console.error(
        "Erreur lors de l'envoi de l'email de notification:",
        error,
      );
    }
  }

  return newAppointment;
}

/**
 * Modifie un rendez-vous existant
 */
export async function updateAppointment(
  appointmentId: string,
  data: {
    patientId?: string;
    beginAt?: Date;
    endAt?: Date;
    atHome?: boolean;
    note?: string;
    status?: "CREATED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  },
) {
  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organization not found");

  const [updatedAppointment] = await db
    .update(appointments)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(appointments.id, appointmentId),
        eq(appointments.organizationId, organization.id),
      ),
    )
    .returning();

  if (!updatedAppointment) {
    throw new Error("Rendez-vous non trouvé ou non autorisé");
  }

  revalidatePath("/dashboard/agenda");

  return updatedAppointment;
}

export async function deleteAppointment(appointmentId: string) {
  try {
    const organization = await getCurrentOrganization();
    if (!organization) throw new Error("Organization not found");

    const [deletedAppointment] = await db
      .delete(appointments)
      .where(
        and(
          eq(appointments.id, appointmentId),
          eq(appointments.organizationId, organization.id),
        ),
      )
      .returning();

    revalidatePath("/dashboard/agenda");

    return deletedAppointment;
  } catch (error) {
    console.error("Error deleting appointment", error);
    throw new Error("Error deleting appointment");
  }
}

/**
 * Récupère les rendez-vous du jour actuel
 */
export async function getTodayAppointments() {
  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organization not found");

  const today = new Date();
  const dayStart = startOfDay(today);
  const dayEnd = endOfDay(today);

  const results = await db.query.appointments.findMany({
    where: and(
      eq(appointments.organizationId, organization.id),
      gte(appointments.beginAt, dayStart),
      lte(appointments.beginAt, dayEnd),
    ),
    orderBy: (appointments, { asc }) => [asc(appointments.beginAt)],
    with: {
      patient: {
        with: {
          owner: {
            columns: {
              id: true,
              name: true,
              email: true,
              image: true,
              phone: true,
            },
          },
          animal: {
            columns: {
              code: true,
              name: true,
            },
          },
        },
      },
      organization: true,
    },
  });

  return results as Appointment[];
}

/**
 * Récupère les rendez-vous complétés qui n'ont pas de rapport associé
 * @param daysBack Nombre de jours en arrière à vérifier (par défaut 30)
 * @returns Liste des rendez-vous sans rapport
 */
export async function getAppointmentsWithoutReport(daysBack: number = 30) {
  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organization not found");

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  // Récupérer tous les rendez-vous complétés depuis cutoffDate
  const completedAppointments = await db.query.appointments.findMany({
    where: and(
      eq(appointments.organizationId, organization.id),
      eq(appointments.status, "COMPLETED"),
      gte(appointments.beginAt, cutoffDate),
    ),
    with: {
      patient: {
        with: {
          owner: {
            columns: {
              id: true,
              name: true,
              email: true,
            },
          },
          animal: {
            columns: {
              name: true,
            },
          },
        },
      },
      organization: true,
      reports: {
        columns: {
          id: true,
        },
      },
    },
  });

  // Filtrer ceux qui n'ont pas de rapport
  const appointmentsWithoutReport = completedAppointments.filter(
    (apt) => !apt.reports || apt.reports.length === 0,
  );

  return appointmentsWithoutReport;
}

/**
 * Récupère les rendez-vous d'un patient spécifique
 * @param patientId ID du patient
 * @returns Liste des rendez-vous du patient
 */
export async function getAppointmentsByPatientId(patientId: string) {
  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organization not found");

  const results = await db.query.appointments.findMany({
    where: and(
      eq(appointments.organizationId, organization.id),
      eq(appointments.patientId, patientId),
    ),
    orderBy: (appointments, { desc }) => [desc(appointments.beginAt)],
    with: {
      patient: {
        with: {
          owner: {
            columns: {
              id: true,
              name: true,
              email: true,
            },
          },
          animal: {
            columns: {
              code: true,
              name: true,
            },
          },
        },
      },
      organization: true,
    },
  });

  return results as Appointment[];
}
