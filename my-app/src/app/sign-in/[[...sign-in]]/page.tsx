"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Editorial Modernism Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-3">
            Willkommen
          </h1>
          <div className="w-16 h-1 bg-accent mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            Melde dich an, um TiMax zu nutzen
          </p>
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
