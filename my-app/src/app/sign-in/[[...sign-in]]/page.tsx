"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="animate-in fade-in slide-in-from-bottom-4 w-full max-w-md duration-500">
        {/* Editorial Modernism Header */}
        <div className="mb-8 text-center">
          <h1 className="text-foreground mb-3 font-serif text-4xl font-bold sm:text-5xl">
            Willkommen
          </h1>
          <div className="bg-accent mx-auto mb-3 h-1 w-16" />
          <p className="text-muted-foreground text-sm">Melde dich an, um TiMax zu nutzen</p>
        </div>

        {/* SignIn Component - nutzt globales Theme */}
        <SignIn
          routing="hash"
          fallbackRedirectUrl="/chat"
          appearance={{
            elements: {
              // Nur lokale Overrides für diese Seite
              rootBox: "w-full",
              card: "bg-card border border-border shadow-editorial-md rounded-[6px] p-6",
              headerTitle: "hidden", // Wir haben unseren eigenen Header
              headerSubtitle: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
}
