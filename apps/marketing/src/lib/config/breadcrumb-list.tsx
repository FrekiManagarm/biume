export const breadcrumbProList = (reportId?: string) => [
  {
    title: "Atelier",
    href: `/dashboard`,
  },
  {
    title: "Agenda",
    href: `/dashboard/agenda`,
  },
  {
    title: "Propriétaires",
    href: `/dashboard/clients`,
  },
  {
    title: "Patients",
    href: `/dashboard/patients`,
  },
  {
    title: "Comptes rendus",
    href: `/dashboard/reports`,
    items: [
      {
        title: "Nouveau compte rendu",
        href: `/dashboard/reports/new`,
      },
      {
        title: "Compte rendu",
        href: `/dashboard/reports/${reportId}`,
      },
      {
        title: "Edition",
        href: `/dashboard/reports/${reportId}/edit`,
      },
    ],
  },
  {
    title: "Paramètres",
    href: `/dashboard/settings`,
  },
];
