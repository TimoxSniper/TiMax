import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldOff, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <ShieldOff className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">Kein Zugriff</h1>
          <div className="mx-auto h-1 w-16 bg-accent" />
          <p className="text-muted-foreground text-lg">
            Du hast keine Berechtigung, diese Seite aufzurufen.
          </p>
          <p className="text-muted-foreground text-sm">
            Nur Administratoren können den Admin-Bereich betreten. Wende dich an einen Administrator,
            falls du glaubst, dass dies ein Fehler ist.
          </p>
        </div>

        <Button asChild>
          <Link href="/chat">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zum Chat
          </Link>
        </Button>
      </div>
    </div>
  );
}
