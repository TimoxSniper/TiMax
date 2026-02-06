"use client";

import { MainNavigation } from "@/components/layout/main-navigation";
import { UploadList } from "@/components/upload/upload-list";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";


export default function UploadsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <MainNavigation />

            <main className="flex-1 container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="space-y-10">
                    {/* Editorial Modernism Header */}
                    <header>
                        <h1 className="font-serif text-5xl lg:text-6xl font-bold text-foreground mb-4">
                            Ihre Dateien
                        </h1>
                        <div className="w-24 h-1 bg-accent mb-6" />
                        <p className="text-lg text-muted-foreground max-w-2xl">
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
                            <UploadList />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
