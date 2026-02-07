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

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-foreground text-3xl font-bold">Einstellungen</h1>
            <p className="text-muted-foreground mt-2">
              Verwalte dein Konto und deine Sicherheitseinstellungen
            </p>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar Navigation */}
            <nav className="flex-shrink-0 lg:w-64">
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
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted text-foreground"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p
                              className={cn(
                                "truncate text-xs",
                                isActive ? "text-primary-foreground/70" : "text-muted-foreground"
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
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
