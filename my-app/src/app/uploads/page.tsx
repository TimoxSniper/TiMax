"use client";

import { MainNavigation } from "@/components/layout/main-navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DynamicUploadList } from "@/lib/dynamic-import";

export default function UploadsPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MainNavigation />

      <main className="container mx-auto max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="space-y-10">
          {/* Editorial Modernism Header */}
          <header>
            <h1 className="text-foreground mb-4 font-serif text-5xl font-bold lg:text-6xl">
              Ihre Dateien
            </h1>
            <div className="bg-accent mb-6 h-1 w-24" />
            <p className="text-muted-foreground max-w-2xl text-lg">
              Verwalten Sie Ihre hochgeladenen Transkripte und erstellen Sie daraus KI-Inhalte.
            </p>
          </header>

          {/* Uploads Card */}
          <Card>
            <CardHeader>
              <CardTitle>Gespeicherte Transkripte</CardTitle>
              <CardDescription>
                Hier finden Sie alle bisher verarbeiteten Audio- und Videodateien.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DynamicUploadList />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
