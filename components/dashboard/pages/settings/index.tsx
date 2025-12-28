"use client";

import { Button } from "@/components/ui/button";
import { Bell, CreditCard, Shield, User, UserX } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import ProfileTab from "./components/profile-tab";
import BillingTab from "./components/billing-tab";
import NotificationTab from "./components/notifications-tab";
import AccountTab from "./components/account-tab";
import { Organization } from "@/lib/schemas";

const SettingsPageComponent = ({ org }: { org: Organization }) => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    {
      id: "profile",
      title: "Profil",
      icon: User,
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
    },
    {
      id: "billing",
      title: "Facturation",
      icon: CreditCard,
    },
    {
      id: "account",
      title: "Compte",
      icon: UserX,
    },
  ];

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex flex-col md:flex-row w-full h-full gap-4">
        <div className="w-full md:w-72 lg:w-80 shrink-0">
          <Card className="sticky top-0">
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
              <CardDescription>
                Gérez vos paramètres et les préférences de votre compte.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 px-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    className="w-full justify-start gap-3 rounded-md"
                    size="lg"
                    variant={isActive ? "default" : "ghost"}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="size-4" />
                    <span className="text-sm font-medium">{tab.title}</span>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="w-full">
          {activeTab === "profile" && <ProfileTab org={org} />}
          {activeTab === "notifications" && <NotificationTab />}
          {activeTab === "billing" && <BillingTab />}
          {activeTab === "account" && <AccountTab />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPageComponent;
