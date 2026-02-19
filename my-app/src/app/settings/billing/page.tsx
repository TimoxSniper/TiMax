"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { SubscriptionDetailsButton } from "@clerk/nextjs/experimental";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CreditCard,
  ExternalLink,
  Zap,
  Crown,
  Building,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const PLAN_INFO = {
  starter: {
    name: "Starter",
    icon: Zap,
    description: "Perfekt für den Einstieg",
    color: "text-blue-500",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  pro: {
    name: "Pro",
    icon: Crown,
    description: "Für aktive Creator",
    color: "text-accent",
    badgeClass: "bg-accent/10 text-accent",
  },
  business: {
    name: "Business",
    icon: Building,
    description: "Für Profis",
    color: "text-purple-500",
    badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
} as const;

export default function BillingSettingsPage() {
  const { isLoaded } = useUser();
  const { has } = useAuth();

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const currentPlanSlug = (Object.keys(PLAN_INFO) as Array<keyof typeof PLAN_INFO>).find(
    (slug) => has?.({ plan: slug })
  ) ?? null;

  const currentPlan = currentPlanSlug ? PLAN_INFO[currentPlanSlug] : null;
  const PlanIcon = currentPlan?.icon;

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Aktuelles Abonnement
          </CardTitle>
          <CardDescription>Dein aktiver Plan und Abrechnungsdetails</CardDescription>
        </CardHeader>
        <CardContent>
          {currentPlan && PlanIcon ? (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary flex h-12 w-12 items-center justify-center rounded-[6px]">
                  <PlanIcon className={`h-6 w-6 ${currentPlan.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{currentPlan.name}</p>
                    <Badge className={currentPlan.badgeClass}>Aktiv</Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">{currentPlan.description}</p>
                </div>
              </div>
              <SubscriptionDetailsButton>
                <Button variant="outline" className="gap-2 flex-shrink-0">
                  <ExternalLink className="h-4 w-4" />
                  Abo verwalten
                </Button>
              </SubscriptionDetailsButton>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Kein aktiver Plan</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Wähle einen Plan, um loszulegen.
                </p>
              </div>
              <Button asChild size="sm" className="flex-shrink-0 gap-2">
                <Link href="/pricing">
                  Plan wählen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Portal */}
      {currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Abrechnung & Rechnungen</CardTitle>
            <CardDescription>
              Zahlungsmethoden, Rechnungen und Abo-Einstellungen verwalten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted space-y-2 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="text-green-500 h-4 w-4 flex-shrink-0" />
                <span>Zahlungsmethode ändern</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="text-green-500 h-4 w-4 flex-shrink-0" />
                <span>Rechnungen herunterladen</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="text-green-500 h-4 w-4 flex-shrink-0" />
                <span>Plan upgraden oder kündigen</span>
              </div>
            </div>
            <SubscriptionDetailsButton>
              <Button className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Billing-Portal öffnen
              </Button>
            </SubscriptionDetailsButton>
          </CardContent>
        </Card>
      )}

      {/* Upgrade CTA (nicht für Business-User) */}
      {currentPlanSlug && currentPlanSlug !== "business" && (
        <Card>
          <CardHeader>
            <CardTitle>Plan upgraden</CardTitle>
            <CardDescription>Hol mehr aus timax heraus</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="gap-2">
              <Link href="/pricing">
                Alle Pläne ansehen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
