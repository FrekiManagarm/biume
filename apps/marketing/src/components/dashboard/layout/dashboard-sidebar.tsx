"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  organization,
  signOut,
  useActiveOrganization,
} from "@/lib/auth/auth-client";
import { proMenuList, Menu, Submenu } from "@/lib/config/menu-list";
import {
  Building,
  AlertCircle,
  Check,
  Plus,
  ChevronsUpDown,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
  SidebarSeparator,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/style";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AccountSwitchDialog } from "../dialogs/account-switch-dialog";
import { toast } from "sonner";
import { Credenza } from "@/components/ui/credenza";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Stepper from "@/components/onboarding/components/stepper";
import { Session } from "@/lib/auth/auth-server";
import { Organization } from "@/lib/schemas";
// Separator intégré au composant Sidebar via SidebarSeparator
import Link from "next/link";
import { useCustomer } from "autumn-js/react";
import { logger } from "@/lib/utils/logger";
import { UserProfileDialog } from "../dialogs/user-profile-dialog";
import { User as UserType } from "@/lib/schemas/user";

interface DashboardSidebarProps {
  session: Session;
  organizations: Organization[];
}

export function DashboardSidebar({
  session,
  organizations,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: activeOrganization } = useActiveOrganization();
  const { state, isMobile } = useSidebar();
  const [switchingOrg, setSwitchingOrg] = useState<string | null>(null);
  const [showProfessionalDialog, setShowProfessionalDialog] = useState(false);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCredenza, setShowCredenza] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { refetch } = useCustomer();

  // Récupérer les menus
  const menuGroups = proMenuList(pathname || "");
  const menuButtonClassName =
    "h-12 rounded-[1.15rem] px-4 text-[15px] font-semibold text-muted-foreground transition-all hover:bg-secondary/10 hover:text-secondary data-[active=true]:border data-[active=true]:border-secondary/30 data-[active=true]:bg-secondary/10 data-[active=true]:text-secondary data-[active=true]:shadow-sm";
  const subMenuButtonClassName =
    "h-9 rounded-xl text-muted-foreground hover:bg-secondary/10 hover:text-secondary data-[active=true]:bg-secondary/10 data-[active=true]:text-secondary";

  const handleOrganizationSwitch = async (orgId: string) => {
    setSwitchingOrg(orgId);
    setActiveOrgId(orgId);
    setIsLoading(true);
    setShowProfessionalDialog(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const result = await organization.setActive({
        organizationId: orgId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      await refetch();

      router.push(`/dashboard`);
      setIsLoading(false);
    } catch (error) {
      logger.error("Error changing organization:", error);
      toast.error("Erreur lors du changement de compte", {
        description: "Veuillez réessayer",
        icon: <AlertCircle className="h-5 w-5 text-white" />,
      });
      setShowProfessionalDialog(false);
    } finally {
      setSwitchingOrg(null);
    }
  };

  // Composant pour le menu replié avec dropdown
  const CollapsedSubMenu = ({ menu }: { menu: Menu }) => {
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              isActive={menu.active}
              tooltip={menu.label}
              className={menuButtonClassName}
            >
              {menu.icon && <menu.icon className="h-4 w-4" />}
              <span>{menu.label}</span>
              <ChevronRight className="ml-auto h-4 w-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-48">
            <DropdownMenuLabel>{menu.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {menu.submenus?.map((submenu: Submenu, index: number) => (
              <DropdownMenuItem key={index} asChild>
                <a
                  href={submenu.href}
                  className={cn(
                    "flex items-center gap-2",
                    submenu.active && "bg-accent text-accent-foreground",
                  )}
                >
                  {submenu.icon && <submenu.icon className="h-4 w-4" />}
                  <span>{submenu.label}</span>
                </a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  };

  // Composant pour le menu déployé avec sous-menus
  const ExpandedSubMenu = ({ menu }: { menu: Menu }) => {
    return (
      <Collapsible defaultOpen={menu.active}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className={cn("group", menuButtonClassName)}
              isActive={menu.active}
            >
              {menu.icon && <menu.icon className="h-4 w-4" />}
              <span>{menu.label}</span>
              <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {menu.submenus?.map((submenu: Submenu, index: number) => (
                <SidebarMenuSubItem key={index}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={submenu.active}
                    className={subMenuButtonClassName}
                  >
                    <Link
                      href={submenu.href}
                      className="flex items-center gap-2"
                    >
                      {submenu.icon && <submenu.icon className="h-4 w-4" />}
                      <span>{submenu.label}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-border/70">
      <SidebarHeader className="p-5 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="h-14 rounded-[1.25rem] px-3 data-[state=open]:bg-secondary/10 data-[state=open]:text-secondary"
                >
                  <div className="flex aspect-square size-10 items-center justify-center overflow-hidden rounded-2xl bg-secondary/10 text-secondary">
                    {activeOrganization?.logo ? (
                      <Image
                        src={activeOrganization?.logo ?? ""}
                        alt={activeOrganization?.name ?? ""}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building className="size-5" />
                    )}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeOrganization?.name ?? "Biume"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      Espace praticien
                    </span>
                  </div>
                  <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-bold text-secondary group-data-[collapsible=icon]:hidden">
                    BETA
                  </span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side={isMobile ? "bottom" : "right"}
                className="w-64 p-2 rounded-lg border border-border/40 shadow-lg animate-in fade-in-50 zoom-in-95 slide-in-from-top-5 duration-200"
              >
                {organizations && organizations.length > 0 && (
                  <>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs font-medium px-2 py-1.5 text-muted-foreground">
                        Comptes professionnels
                      </DropdownMenuLabel>
                      <div className="max-h-[200px] overflow-y-auto my-1 rounded-md space-y-0.5 pr-1">
                        {organizations.map((org) => (
                          <DropdownMenuItem
                            key={org.id}
                            className={cn(
                              "group flex items-center gap-3 p-2 rounded-md transition-all cursor-pointer duration-200",
                              activeOrganization?.id === org.id
                                ? "bg-primary/10 text-primary font-medium shadow-sm"
                                : "hover:bg-accent hover:translate-x-1 hover:shadow-sm",
                              switchingOrg === org.id &&
                                "animate-pulse opacity-70",
                            )}
                            onSelect={() => handleOrganizationSwitch(org.id)}
                            disabled={switchingOrg !== null}
                          >
                            {org.logo ? (
                              <div
                                className={cn(
                                  "h-8 w-8 overflow-hidden rounded-md shadow-sm shrink-0 transition-all duration-300",
                                  activeOrganization?.id === org.id
                                    ? "ring-2 ring-primary/30"
                                    : "ring-1 ring-border/50 hover:ring-primary/20",
                                )}
                              >
                                <Image
                                  src={org.logo}
                                  alt={org.name}
                                  width={32}
                                  height={32}
                                  className={cn(
                                    "h-full w-full object-cover transition-transform duration-300",
                                    activeOrganization?.id !== org.id &&
                                      "hover:scale-110",
                                  )}
                                />
                              </div>
                            ) : (
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-md flex items-center justify-center shrink-0 transition-all duration-300",
                                  activeOrganization?.id === org.id
                                    ? "bg-primary/20"
                                    : "bg-primary/10 hover:bg-primary/15",
                                )}
                              >
                                <Building className="h-4 w-4 text-primary" />
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="text-sm font-medium leading-none">
                                {org.name}
                              </span>
                              <span className="text-xs text-muted-foreground mt-1">
                                Compte professionnel
                              </span>
                            </div>
                            {activeOrganization?.id === org.id && (
                              <Check className="h-4 w-4 ml-auto text-primary animate-in zoom-in-50 duration-300" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuLabel className="text-xs font-medium px-2 py-1.5 text-muted-foreground">
                        Nouvelle entreprise
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => setShowCredenza(true)}
                        className="group flex items-center gap-3 p-2 rounded-md hover:bg-accent hover:translate-x-1 transition-all cursor-pointer duration-200 hover:shadow-sm"
                      >
                        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 transition-all duration-300 hover:bg-primary/20">
                          <Plus className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium leading-none">
                            Créer une entreprise
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            Devenez professionnel
                          </span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="bg-border/70" />

      <SidebarContent className="gap-1 px-3 py-4">
        {/* Menus principaux sans groupe */}
        {menuGroups
          .filter((group) => !group.groupLabel)
          .map((group, groupIndex) => (
            <SidebarGroup key={groupIndex} className="p-0">
              <SidebarMenu className="gap-1.5">
                {group.menus.map((menu, menuIndex) => {
                  if (menu.submenus) {
                    return state === "collapsed" ? (
                      <CollapsedSubMenu key={menuIndex} menu={menu} />
                    ) : (
                      <ExpandedSubMenu key={menuIndex} menu={menu} />
                    );
                  }
                  return (
                    <SidebarMenuItem key={menuIndex}>
                      <SidebarMenuButton
                        asChild
                        isActive={menu.active}
                        className={menuButtonClassName}
                        tooltip={state === "collapsed" ? menu.label : undefined}
                      >
                        <a
                          href={menu.href}
                          className={cn(
                            "flex items-center gap-3",
                            menu.active && "font-medium",
                          )}
                        >
                          {menu.icon && <menu.icon className="h-4 w-4" />}
                          <span>{menu.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}

        {/* Groupes de menus */}
        {menuGroups
          .filter((group) => group.groupLabel)
          .map((group, groupIndex) => {
            return (
              <SidebarGroup key={groupIndex} className="mt-3 p-0">
                <SidebarGroupLabel className="flex h-9 items-center gap-2 px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/80">
                  <span>{group.groupLabel}</span>
                </SidebarGroupLabel>

                <SidebarMenu className="gap-1.5">
                  {group.menus.map((menu, menuIndex) => {
                    if (menu.submenus) {
                      return state === "collapsed" ? (
                        <CollapsedSubMenu key={menuIndex} menu={menu} />
                      ) : (
                        <ExpandedSubMenu key={menuIndex} menu={menu} />
                      );
                    }
                    return (
                      <SidebarMenuItem key={menuIndex}>
                        <SidebarMenuButton
                          asChild
                          isActive={menu.active && !menu.comingSoon}
                          disabled={menu.comingSoon}
                          className={menuButtonClassName}
                          tooltip={
                            state === "collapsed" ? menu.label : undefined
                          }
                        >
                          <a
                            href={menu.href}
                            className={cn(
                              "flex items-center gap-3",
                              menu.active && "font-medium",
                            )}
                          >
                            {menu.icon && <menu.icon className="h-4 w-4" />}
                            <span>{menu.label}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroup>
            );
          })}
      </SidebarContent>
      <SidebarFooter className="border-t border-border/70 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="h-14 rounded-[1.25rem] px-3 data-[state=open]:bg-secondary/10 data-[state=open]:text-secondary"
                >
                  <Avatar className="h-10 w-10 rounded-2xl">
                    <AvatarImage
                      src={session.user.image ?? ""}
                      alt={session.user.name ?? ""}
                    />
                    <AvatarFallback className="rounded-2xl bg-muted font-semibold">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {session.user.name}
                    </span>
                    <span className="truncate text-xs">
                      {session.user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={session.user.image ?? ""}
                        alt={session.user.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {session.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {session.user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setShowProfile(true)}>
                  <User className="size-4" />
                  Mon profil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 group text-red-500"
                  onClick={async () => {
                    await signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          router.push("/sign-in");
                        },
                      },
                    });
                  }}
                >
                  <LogOut className="size-4 text-red-500 group-hover:text-white" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <AccountSwitchDialog
        open={showProfessionalDialog}
        onOpenChange={setShowProfessionalDialog}
        type="professional"
        organizationName={
          organizations?.find((org) => org.id === activeOrgId)?.name
        }
        isLoading={isLoading}
      />

      <Credenza open={showCredenza} onOpenChange={setShowCredenza}>
        <Stepper />
      </Credenza>

      <UserProfileDialog
        open={showProfile}
        onOpenChange={setShowProfile}
        user={session.user as UserType}
      />
    </Sidebar>
  );
}
