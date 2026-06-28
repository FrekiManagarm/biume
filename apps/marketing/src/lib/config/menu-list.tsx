import {
  Contact2,
  CalendarDays,
  LayoutGrid,
  LucideIcon,
  NotepadText,
  PawPrint,
  Settings,
} from "lucide-react";

export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  comingSoon?: boolean;
  icon: LucideIcon;
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
  comingSoon?: boolean;
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function proMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: `/dashboard`,
          label: "Atelier",
          active: pathname === `/dashboard`,
          icon: LayoutGrid,
        },
        {
          href: `/dashboard/reports`,
          label: "Comptes rendus",
          active: pathname.startsWith(`/dashboard/reports`),
          icon: NotepadText,
        },
        {
          href: `/dashboard/agenda`,
          label: "Agenda",
          active: pathname === `/dashboard/agenda`,
          icon: CalendarDays,
        },
      ],
    },
    {
      groupLabel: "Suivi",
      menus: [
        {
          href: `/dashboard/clients`,
          label: "Propriétaires",
          active: pathname === `/dashboard/clients`,
          icon: Contact2,
        },
        {
          href: `/dashboard/patients`,
          label: "Patients",
          active: pathname === `/dashboard/patients`,
          icon: PawPrint,
        },
      ],
    },
    {
      groupLabel: "Autre",
      menus: [
        {
          href: `/dashboard/settings`,
          label: "Paramètres",
          active: pathname.startsWith(`/dashboard/settings`),
          icon: Settings,
        },
      ],
    },
  ];
}
