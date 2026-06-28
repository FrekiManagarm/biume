"use server";

import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "@/lib/utils/db";
import { clients } from "@/lib/schemas/clients";
import { pets } from "@/lib/schemas/pets";
import { animals } from "@/lib/schemas/animals";
import { advancedReport } from "@/lib/schemas/advancedReport/advancedReport";
import { getCurrentOrganization } from "./auth.action";
import { appointments } from "@/lib/schemas/appointments";

// Calcule une date de début sur N jours glissants
function getStartDateFromDaysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  // normaliser à minuit pour stabilité
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function countNewClientsLastNDays(days: number = 90) {
  const org = await getCurrentOrganization();
  if (!org) throw new Error("Organization not found");

  const start = getStartDateFromDaysAgo(days);

  const rows = await db
    .select({ id: clients.id })
    .from(clients)
    .where(
      and(eq(clients.organizationId, org.id), gte(clients.createdAt, start)),
    );

  return rows.length;
}

export async function countActivePatients() {
  const org = await getCurrentOrganization();
  if (!org) throw new Error("Organization not found");

  const rows = await db
    .select({ id: pets.id })
    .from(pets)
    .where(eq(pets.organizationId, org.id));

  return rows.length;
}

export async function countSentReportsLastNDays(days: number = 30) {
  const org = await getCurrentOrganization();
  if (!org) throw new Error("Organization not found");

  const start = getStartDateFromDaysAgo(days);

  const rows = await db
    .select({ id: advancedReport.id })
    .from(advancedReport)
    .where(
      and(
        eq(advancedReport.createdBy, org.id),
        eq(advancedReport.status, "sent"),
        gte(advancedReport.createdAt, start),
      ),
    );

  return rows.length;
}

export async function countDraftReports() {
  const org = await getCurrentOrganization();
  if (!org) throw new Error("Organization not found");

  const rows = await db
    .select({ id: advancedReport.id })
    .from(advancedReport)
    .where(
      and(
        eq(advancedReport.createdBy, org.id),
        eq(advancedReport.status, "draft"),
      ),
    );

  return rows.length;
}

// Helpers de delta
type Trend = "up" | "down";
type MetricDelta = { value: string; trend: Trend };
type MetricResult = { value: number; delta: MetricDelta };

function toPercentDelta(current: number, previous: number): MetricDelta {
  if (previous === 0) {
    if (current === 0) return { value: "0%", trend: "up" };
    return { value: "+100%", trend: "up" };
  }
  const raw = ((current - previous) / previous) * 100;
  const rounded = Math.round(raw);
  const sign = rounded > 0 ? "+" : "";
  return { value: `${sign}${rounded}%`, trend: rounded >= 0 ? "up" : "down" };
}

function toAbsoluteDelta(current: number, previous: number): MetricDelta {
  const diff = current - previous;
  const sign = diff > 0 ? "+" : "";
  return { value: `${sign}${diff}`, trend: diff >= 0 ? "up" : "down" };
}

// Nouveaux clients: période courante vs période précédente (même durée)
export async function getNewClientsMetric(
  days: number = 90,
): Promise<MetricResult> {
  const org = await getCurrentOrganization();
  if (!org) throw new Error("Organization not found");
  const start = getStartDateFromDaysAgo(days);
  const prevStart = getStartDateFromDaysAgo(days * 2);

  const [currentRows, previousRows] = await Promise.all([
    db
      .select({ id: clients.id })
      .from(clients)
      .where(
        and(eq(clients.organizationId, org.id), gte(clients.createdAt, start)),
      ),
    db
      .select({ id: clients.id })
      .from(clients)
      .where(
        and(
          eq(clients.organizationId, org.id),
          gte(clients.createdAt, prevStart),
        ),
      ),
  ]);

  const current = currentRows.length;
  const previous =
    previousRows.filter(() => {
      // previous period = [prevStart, start)
      return true; // approximation car on ne sélectionne que par >= prevStart; on affine ci-dessous côté base si besoin
    }).length - current; // retrait de la période courante

  const safePrevious = Math.max(previous, 0);
  return { value: current, delta: toPercentDelta(current, safePrevious) };
}

// Nouveaux patients: même logique que clients (sur N jours)
export async function getNewPatientsMetric(
  days: number = 90,
): Promise<MetricResult> {
  const org = await getCurrentOrganization();
  if (!org) throw new Error("Organization not found");
  const start = getStartDateFromDaysAgo(days);
  const prevStart = getStartDateFromDaysAgo(days * 2);

  const [currentRows, previousRows] = await Promise.all([
    db
      .select({ id: pets.id })
      .from(pets)
      .where(and(eq(pets.organizationId, org.id), gte(pets.createdAt, start))),
    db
      .select({ id: pets.id })
      .from(pets)
      .where(
        and(eq(pets.organizationId, org.id), gte(pets.createdAt, prevStart)),
      ),
  ]);

  const current = currentRows.length;
  const previous = previousRows.length - current;
  const safePrevious = Math.max(previous, 0);
  return { value: current, delta: toPercentDelta(current, safePrevious) };
}

// Rapports envoyés: sur N jours vs période précédente
export async function getSentReportsMetric(
  days: number = 30,
): Promise<MetricResult> {
  const org = await getCurrentOrganization();
  if (!org) throw new Error("Organization not found");
  const start = getStartDateFromDaysAgo(days);
  const prevStart = getStartDateFromDaysAgo(days * 2);

  const [currentRows, previousRows] = await Promise.all([
    db
      .select({ id: advancedReport.id })
      .from(advancedReport)
      .where(
        and(
          eq(advancedReport.createdBy, org.id),
          eq(advancedReport.status, "sent"),
          gte(advancedReport.createdAt, start),
        ),
      ),
    db
      .select({ id: advancedReport.id })
      .from(advancedReport)
      .where(
        and(
          eq(advancedReport.createdBy, org.id),
          eq(advancedReport.status, "sent"),
          gte(advancedReport.createdAt, prevStart),
        ),
      ),
  ]);

  const current = currentRows.length;
  const previous = previousRows.length - current;
  const safePrevious = Math.max(previous, 0);
  return { value: current, delta: toPercentDelta(current, safePrevious) };
}

// Brouillons: nombre sur N jours vs période précédente (delta absolu)
export async function getDraftReportsMetric(
  days: number = 30,
): Promise<MetricResult> {
  const org = await getCurrentOrganization();
  if (!org) throw new Error("Organization not found");
  const start = getStartDateFromDaysAgo(days);
  const prevStart = getStartDateFromDaysAgo(days * 2);

  const [currentRows, previousRows] = await Promise.all([
    db
      .select({ id: advancedReport.id })
      .from(advancedReport)
      .where(
        and(
          eq(advancedReport.createdBy, org.id),
          eq(advancedReport.status, "draft"),
          gte(advancedReport.createdAt, start),
        ),
      ),
    db
      .select({ id: advancedReport.id })
      .from(advancedReport)
      .where(
        and(
          eq(advancedReport.createdBy, org.id),
          eq(advancedReport.status, "draft"),
          gte(advancedReport.createdAt, prevStart),
        ),
      ),
  ]);

  const current = currentRows.length;
  const previous = previousRows.length - current;
  const safePrevious = Math.max(previous, 0);
  return { value: current, delta: toAbsoluteDelta(current, safePrevious) };
}

// Répartition clientèle par espèce (Chiens/Chats/Chevaux/Autres) basée sur pets
export type SpeciesItem = {
  status: "Chiens" | "Chats" | "Chevaux" | "Autres";
  count: number;
  percentage: number;
  color: string; // classe Tailwind pour cohérence UI
};

export async function getClienteleBySpecies(): Promise<SpeciesItem[]> {
  const org = await getCurrentOrganization();
  if (!org) throw new Error("Organization not found");

  // Récupérer tous les pets de l'organisation avec leur animal pour catégorisation
  const rows = await db
    .select({
      id: pets.id,
      animalName: animals.name,
    })
    .from(pets)
    .leftJoin(animals, eq(pets.type, animals.id))
    .where(eq(pets.organizationId, org.id));

  const buckets = {
    Chiens: 0,
    Chats: 0,
    Chevaux: 0,
    Autres: 0,
  } as Record<SpeciesItem["status"], number>;

  for (const row of rows) {
    const name = (row.animalName || "").toLowerCase();
    if (
      name === "dog" ||
      name === "chien" ||
      name === "dogs" ||
      name === "chiens"
    ) {
      buckets.Chiens += 1;
    } else if (
      name === "cat" ||
      name === "chat" ||
      name === "cats" ||
      name === "chats"
    ) {
      buckets.Chats += 1;
    } else if (
      name === "horse" ||
      name === "cheval" ||
      name === "horses" ||
      name === "chevaux"
    ) {
      buckets.Chevaux += 1;
    } else {
      buckets.Autres += 1;
    }
  }

  const total = Object.values(buckets).reduce((s, v) => s + v, 0) || 1;

  const items: SpeciesItem[] = [
    {
      status: "Chiens",
      count: buckets.Chiens,
      percentage: Math.round((buckets.Chiens / total) * 100),
      color: "bg-blue-500",
    },
    {
      status: "Chats",
      count: buckets.Chats,
      percentage: Math.round((buckets.Chats / total) * 100),
      color: "bg-purple-500",
    },
    {
      status: "Chevaux",
      count: buckets.Chevaux,
      percentage: Math.round((buckets.Chevaux / total) * 100),
      color: "bg-amber-500",
    },
    {
      status: "Autres",
      count: buckets.Autres,
      percentage: Math.round((buckets.Autres / total) * 100),
      color: "bg-emerald-500",
    },
  ];

  return items;
}

// Activité récente: compose événements depuis rapports et nouveaux patients
export type RecentActivityItem = {
  id: string;
  type: "report" | "new_patient";
  title: string;
  description: string;
  timestamp: string; // libellé prêt à afficher
  occurredAt: Date; // pour tri (non utilisé côté UI)
};

function formatRelativeTime(date: Date): string {
  const now = new Date().getTime();
  const diff = Math.max(0, now - date.getTime());
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < hour) {
    const m = Math.max(1, Math.round(diff / minute));
    return `Il y a ${m} min`;
  } else if (diff < day) {
    const h = Math.round(diff / hour);
    return `Il y a ${h}h`;
  } else {
    const d = Math.round(diff / day);
    return d === 1 ? "Hier" : `Il y a ${d} j`;
  }
}

export async function getRecentActivity(
  limit: number = 8,
): Promise<RecentActivityItem[]> {
  const org = await getCurrentOrganization();
  if (!org) throw new Error("Organization not found");

  // Rapports envoyés ou finalisés récents
  const reports = await db
    .select({
      id: advancedReport.id,
      title: advancedReport.title,
      status: advancedReport.status,
      createdAt: advancedReport.createdAt,
    })
    .from(advancedReport)
    .where(and(eq(advancedReport.createdBy, org.id)))
    .orderBy(advancedReport.createdAt);
  // Neon/Drizzle ne supporte pas tous les modifs ici: on limitera après merge
  // Nouveaux patients récents
  const recentPets = await db
    .select({ id: pets.id, name: pets.name, createdAt: pets.createdAt })
    .from(pets)
    .where(eq(pets.organizationId, org.id))
    .orderBy(pets.createdAt);
  const reportEvents: RecentActivityItem[] = reports
    .filter((r) => r.createdAt)
    .map((r) => {
      const occurredAt = new Date(r.createdAt as unknown as string);
      const isSent = r.status === "sent";
      const isFinalized = r.status === "finalized";
      const title = isSent
        ? "Rapport envoyé"
        : isFinalized
          ? "Rapport finalisé"
          : "Rapport mis à jour";
      const description = r.title ?? "Rapport";
      return {
        id: `rep_${r.id}`,
        type: "report",
        title,
        description,
        timestamp: formatRelativeTime(occurredAt),
        occurredAt,
      } satisfies RecentActivityItem;
    });

  const petEvents: RecentActivityItem[] = recentPets
    .filter((p) => p.createdAt)
    .map((p) => {
      const occurredAt = new Date(p.createdAt as unknown as string);
      return {
        id: `pet_${p.id}`,
        type: "new_patient",
        title: "Nouveau patient",
        description: p.name ?? "Patient",
        timestamp: formatRelativeTime(occurredAt),
        occurredAt,
      } satisfies RecentActivityItem;
    });

  const merged = [...reportEvents, ...petEvents]
    .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
    .slice(0, limit);

  return merged;
}

// Derniers rapports pour l'organisation
export type RecentReport = {
  id: string;
  title: string;
  type: "advanced"; // aujourd'hui seul schéma advancedReport existe
  patientName: string;
  consultationReason?: string | null;
  createdAt: string;
};

export async function getRecentReports(
  limit: number = 5,
): Promise<RecentReport[]> {
  const org = await getCurrentOrganization();
  if (!org) throw new Error("Organization not found");

  const rows = await db
    .select({
      id: advancedReport.id,
      title: advancedReport.title,
      consultationReason: advancedReport.consultationReason,
      createdAt: advancedReport.createdAt,
      petName: pets.name,
      petBreed: pets.breed,
    })
    .from(advancedReport)
    .leftJoin(pets, eq(advancedReport.patientId, pets.id))
    .where(eq(advancedReport.createdBy, org.id))
    .orderBy(desc(advancedReport.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    title: r.title ?? "Rapport",
    type: "advanced",
    patientName:
      r.petName && r.petBreed
        ? `${r.petName} (${r.petBreed})`
        : (r.petName ?? "Patient"),
    consultationReason: r.consultationReason ?? undefined,
    createdAt:
      (r.createdAt as unknown as Date)?.toISOString?.() ??
      new Date().toISOString(),
  }));
}

export type WorkbenchReport = {
  id: string;
  title: string;
  status: "draft" | "finalized" | "sent";
  patientName: string;
  ownerName: string;
  ownerEmail?: string | null;
  animalName?: string | null;
  consultationReason?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  anatomicalIssueCount: number;
  recommendationCount: number;
};

export type WorkbenchAppointment = {
  id: string;
  patientId: string;
  patientName: string;
  ownerName: string;
  animalName?: string | null;
  beginAt: string;
  endAt: string;
  status: string;
  note?: string | null;
};

export type WorkbenchPatient = {
  id: string;
  name: string;
  ownerName: string;
  animalName?: string | null;
  breed?: string | null;
  latestReport?: {
    id: string;
    title: string;
    status: "draft" | "finalized" | "sent";
    createdAt: string;
  } | null;
};

export type DashboardWorkbenchData = {
  drafts: WorkbenchReport[];
  readyToSend: WorkbenchReport[];
  sentReports: WorkbenchReport[];
  appointmentsWithoutReport: WorkbenchAppointment[];
  recentPatients: WorkbenchPatient[];
  totals: {
    drafts: number;
    readyToSend: number;
    sent: number;
    appointmentsWithoutReport: number;
  };
};

function toIsoString(value?: Date | string | null) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapWorkbenchReport(report: {
  id: string;
  title: string;
  status: "draft" | "finalized" | "sent";
  consultationReason?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  patient?: {
    name?: string | null;
    animal?: { name?: string | null } | null;
    owner?: { name?: string | null; email?: string | null } | null;
  } | null;
  anatomicalIssues?: unknown[];
  recommendations?: unknown[];
}): WorkbenchReport {
  return {
    id: report.id,
    title: report.title || "Compte rendu anatomique",
    status: report.status,
    patientName: report.patient?.name || "Patient non renseigné",
    ownerName: report.patient?.owner?.name || "Propriétaire non renseigné",
    ownerEmail: report.patient?.owner?.email,
    animalName: report.patient?.animal?.name,
    consultationReason: report.consultationReason,
    createdAt: toIsoString(report.createdAt) ?? new Date().toISOString(),
    updatedAt: toIsoString(report.updatedAt),
    anatomicalIssueCount: report.anatomicalIssues?.length ?? 0,
    recommendationCount: report.recommendations?.length ?? 0,
  };
}

export async function getDashboardWorkbenchData(): Promise<DashboardWorkbenchData> {
  const org = await getCurrentOrganization();
  if (!org) throw new Error("Organization not found");

  const now = new Date();
  const pastWindow = new Date(now);
  pastWindow.setDate(now.getDate() - 14);
  const futureWindow = new Date(now);
  futureWindow.setDate(now.getDate() + 14);

  const [reportRows, appointmentRows, patientRows] = await Promise.all([
    db.query.advancedReport.findMany({
      where: eq(advancedReport.createdBy, org.id),
      orderBy: [desc(advancedReport.updatedAt), desc(advancedReport.createdAt)],
      limit: 24,
      with: {
        patient: {
          with: {
            owner: {
              columns: {
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
        anatomicalIssues: true,
        recommendations: true,
      },
    }),
    db.query.appointments.findMany({
      where: and(
        eq(appointments.organizationId, org.id),
        gte(appointments.beginAt, pastWindow),
        lte(appointments.beginAt, futureWindow),
      ),
      orderBy: [asc(appointments.beginAt)],
      limit: 16,
      with: {
        patient: {
          with: {
            owner: {
              columns: {
                name: true,
              },
            },
            animal: {
              columns: {
                name: true,
              },
            },
          },
        },
        reports: {
          columns: {
            id: true,
          },
        },
      },
    }),
    db.query.pets.findMany({
      where: eq(pets.organizationId, org.id),
      orderBy: [desc(pets.updatedAt), desc(pets.createdAt)],
      limit: 8,
      with: {
        owner: true,
        animal: true,
        advancedReport: true,
      },
    }),
  ]);

  const mappedReports = reportRows.map(mapWorkbenchReport);
  const drafts = mappedReports.filter((report) => report.status === "draft");
  const readyToSend = mappedReports.filter(
    (report) => report.status === "finalized",
  );
  const sentReports = mappedReports.filter((report) => report.status === "sent");

  const appointmentsWithoutReport = appointmentRows
    .filter((appointment) => {
      const reports = (appointment as typeof appointment & { reports?: unknown[] })
        .reports;
      return appointment.status !== "CANCELLED" && (!reports || reports.length === 0);
    })
    .slice(0, 5)
    .map((appointment) => ({
      id: appointment.id,
      patientId: appointment.patientId ?? "",
      patientName: appointment.patient?.name || "Patient non renseigné",
      ownerName:
        appointment.patient?.owner?.name || "Propriétaire non renseigné",
      animalName: appointment.patient?.animal?.name,
      beginAt: appointment.beginAt.toISOString(),
      endAt: appointment.endAt.toISOString(),
      status: appointment.status,
      note: appointment.note,
    }));

  const recentPatients = patientRows.map((patient) => {
    const latestReport = [...(patient.advancedReport ?? [])]
      .filter((report) => report.createdAt)
      .sort(
        (a, b) =>
          new Date(b.createdAt as Date).getTime() -
          new Date(a.createdAt as Date).getTime(),
      )[0];

    return {
      id: patient.id,
      name: patient.name,
      ownerName: patient.owner?.name || "Propriétaire non renseigné",
      animalName: patient.animal?.name,
      breed: patient.breed,
      latestReport: latestReport
        ? {
            id: latestReport.id,
            title: latestReport.title,
            status: latestReport.status,
            createdAt:
              toIsoString(latestReport.createdAt) ?? new Date().toISOString(),
          }
        : null,
    };
  });

  return {
    drafts: drafts.slice(0, 5),
    readyToSend: readyToSend.slice(0, 5),
    sentReports: sentReports.slice(0, 4),
    appointmentsWithoutReport,
    recentPatients,
    totals: {
      drafts: drafts.length,
      readyToSend: readyToSend.length,
      sent: sentReports.length,
      appointmentsWithoutReport: appointmentsWithoutReport.length,
    },
  };
}
