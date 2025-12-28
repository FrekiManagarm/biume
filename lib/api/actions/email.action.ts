"use server";

import ContactEmail from "@/emails/ContactEmail";
import { resend } from "@/lib/utils/resend";
import { contactSchema, ContactSchema } from "@/lib/utils/schemas";
import { render } from "@react-email/render";
import NewReportClientEmail from "@/emails/NewReportClientEmail";
import AppointmentNotificationEmail from "@/emails/AppointmentNotificationEmail";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReportPDF } from "@/components/reports-module/components/ReportPDF";
import { AdvancedReport } from "@/lib/schemas/advancedReport/advancedReport";

export const sendContactEmail = async (data: ContactSchema) => {
  const { name, email, subject, message } = contactSchema.parse(data);

  try {
    const contactEmail = await render(
      ContactEmail({
        name,
        email,
        message,
        subject,
      }),
    );

    const { data, error } = await resend.emails.send({
      from: "Biume <noreply@biume.com>",
      to: "contact@biume.com",
      subject: `Nouveau message de contact de ${name} - ${subject}`,
      html: contactEmail,
    });

    if (error) {
      console.error(error, "error");
      throw new Error("Erreur lors de l'envoi de l'email");
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(error, "error");
    throw new Error("Erreur lors de l'envoi de l'email");
  }
};

export const sendNewReportClientEmail = async (params: {
  to: string;
  clientName: string;
  petName: string;
  reportDate: string;
  reportUrl: string;
}) => {
  const { to, clientName, petName, reportDate, reportUrl } = params;

  try {
    const html = await render(
      NewReportClientEmail({ clientName, petName, reportDate, reportUrl }),
    );

    const { data, error } = await resend.emails.send({
      from: "Biume <noreply@biume.com>",
      to,
      subject: `Nouveau rapport disponible pour ${petName}`,
      html,
    });

    if (error) {
      console.error(error, "error");
      throw new Error("Erreur lors de l'envoi de l'email");
    }

    return { success: true, data };
  } catch (error) {
    console.error(error, "error");
    throw new Error("Erreur lors de l'envoi de l'email");
  }
};

export const sendNewReportClientEmailWithPDF = async (params: {
  to: string;
  clientName: string;
  petName: string;
  reportDate: string;
  reportUrl: string;
  report: Pick<
    AdvancedReport,
    | "id"
    | "title"
    | "createdAt"
    | "patient"
    | "organization"
    | "anatomicalIssues"
    | "recommendations"
  >;
}) => {
  const { to, clientName, petName, reportDate, reportUrl, report } = params;

  try {
    const html = await render(
      NewReportClientEmail({ clientName, petName, reportDate, reportUrl }),
    );

    const pdfBuffer = await renderToBuffer(
      ReportPDF({
        report: {
          id: report.id,
          title: report.title,
          createdAt: report.createdAt || new Date(),
          patient: report.patient,
          organization: report.organization,
          anatomicalIssues: report.anatomicalIssues,
          recommendations: report.recommendations,
        },
        type: "advanced_report",
      }),
    );

    const { data, error } = await resend.emails.send({
      from: "Biume <noreply@biume.com>",
      to,
      subject: `Nouveau rapport disponible pour ${petName}`,
      html,
      attachments: [
        {
          filename: `rapport-${report.id}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error(error, "error");
      throw new Error("Erreur lors de l'envoi de l'email");
    }

    return { success: true, data };
  } catch (error) {
    console.error(error, "error");
    throw new Error("Erreur lors de l'envoi de l'email");
  }
};

export const sendAppointmentNotificationEmail = async (params: {
  to: string;
  clientName: string;
  petName: string;
  appointmentDate: Date;
  appointmentTime: string;
  duration: number;
  atHome: boolean;
  note?: string;
  organizationName?: string;
}) => {
  const {
    to,
    clientName,
    petName,
    appointmentDate,
    appointmentTime,
    duration,
    atHome,
    note,
    organizationName,
  } = params;

  try {
    const html = await render(
      AppointmentNotificationEmail({
        clientName,
        petName,
        appointmentDate,
        appointmentTime,
        duration,
        atHome,
        note,
        organizationName,
      }),
    );

    const { data, error } = await resend.emails.send({
      from: "Biume <noreply@biume.com>",
      to,
      subject: `Nouveau rendez-vous pour ${petName}`,
      html,
    });

    if (error) {
      console.error(error, "error");
      throw new Error("Erreur lors de l'envoi de l'email");
    }

    return { success: true, data };
  } catch (error) {
    console.error(error, "error");
    throw new Error("Erreur lors de l'envoi de l'email");
  }
};
