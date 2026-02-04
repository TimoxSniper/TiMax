"use client";

import { MainNavigation } from "@/components/layout/main-navigation";
import { UploadList } from "@/components/upload/upload-list";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function UploadsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <MainNavigation />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Deine Dateien</h1>
                            <p className="text-muted-foreground">
                                Verwalte deine hochgeladenen Transkripte und erstelle daraus KI-Inhalte.
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Gespeicherte Transkripte</CardTitle>
                            <CardDescription>
                                Hier findest du alle bisher verarbeiteten Audio- und Videodateien.
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
