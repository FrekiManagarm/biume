"use client";

import { useMemo, Fragment, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { ModeToggle } from "@/components/landing-legacy/mode-toggle";
import { useSidebar } from "@/components/ui/sidebar";
import { breadcrumbProList } from "@/lib/config/breadcrumb-list";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useCustomer } from "autumn-js/react";
import { TrialCountdownComponent } from "./trial-countdown";
import { AISearch } from "./ai-search";
import { AIChatDialog } from "./ai-chat-dialog";

export function DashboardHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const params = useParams();
  const { data: customer, isLoading } = useCustomer();
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

  // Vérifier si le customer a un produit en statut "trialing"
  const trialingProduct = customer?.subscriptions?.find(
    (subscription) => subscription.status === "trialing",
  );

  const breadcrumb = breadcrumbProList(params?.reportId as string);

  const trail = useMemo(() => {
    const items: { title: string; href: string }[] = [];
    for (const item of breadcrumb) {
      if (pathname.startsWith(item.href)) {
        items.push({ title: item.title, href: item.href });
        if (
          Array.isArray(
            (item as { items: { title: string; href: string }[] }).items,
          ) &&
          (item as { items: { title: string; href: string }[] }).items.length >
            0
        ) {
          let deepest = null as null | { title: string; href: string };
          for (const sub of (
            item as { items: { title: string; href: string }[] }
          ).items as {
            title: string;
            href: string;
          }[]) {
            if (pathname.startsWith(sub.href)) {
              if (!deepest || sub.href.length > deepest.href.length) {
                deepest = { title: sub.title, href: sub.href };
              }
            }
          }
          if (deepest) items.push(deepest);
        }
      }
    }
    if (items.length === 0 && breadcrumb[0]) {
      items.push({
        title: breadcrumb[0].title as string,
        href: breadcrumb[0].href as string,
      });
    }
    return items;
  }, [breadcrumb, pathname]);

  return (
    <>
      <div className="flex h-[76px] flex-row items-center justify-between border-b bg-background/95 px-5 py-4 backdrop-blur md:px-8">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="m-0 h-9 w-9 rounded-full border-border bg-background p-0 shadow-sm transition-all duration-300 hover:shadow-md"
            onClick={toggleSidebar}
          >
            <PanelLeft size={18} />
          </Button>
          <Separator orientation="vertical" className="mx-3 h-5 bg-border/70" />
          <Breadcrumb>
            <BreadcrumbList className="text-sm">
              {trail.map((crumb, index) => {
                const isLast = index === trail.length - 1;
                return (
                  <Fragment key={crumb.href}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={crumb.href}>{crumb.title}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast ? <BreadcrumbSeparator /> : null}
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center justify-center gap-2">
          {(trialingProduct && trialingProduct.currentPeriodEnd) ||
          isLoading ? (
            <TrialCountdownComponent
              endTime={trialingProduct?.currentPeriodEnd ?? 0}
              isLoading={isLoading}
            />
          ) : null}
          <AISearch onOpen={() => setAiDialogOpen(true)} />
          <ModeToggle />
        </div>
      </div>
      <AIChatDialog open={aiDialogOpen} onOpenChange={setAiDialogOpen} />
    </>
  );
}
