"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { User, Shield, Laptop } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

const settingsNavigation = [
  {
    name: "Profil",
    href: "/settings/profile",
    icon: User,
    description: "Name und Profilbild bearbeiten",
  },
  {
    name: "Sicherheit",
    href: "/settings/security",
    icon: Shield,
    description: "Passwort und 2FA verwalten",
  },
  {
    name: "Sitzungen",
    href: "/settings/sessions",
    icon: Laptop,
    description: "Aktive Geräte verwalten",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Einstellungen</h1>
            <p className="text-muted-foreground mt-2">
              Verwalte dein Konto und deine Sicherheitseinstellungen
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <nav className="lg:w-64 flex-shrink-0">
              <Card className="p-2">
                <ul className="space-y-1">
                  {settingsNavigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted text-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p
                              className={cn(
                                "text-xs truncate",
                                isActive
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              )}
                            >
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </nav>

            {/* Main Content */}
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
