"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Editorial Modernism Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-foreground mb-4">
            Willkommen
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-4" />
          <p className="text-muted-foreground">
            Melde dich an, um TiMax zu nutzen
          </p>
        </div>
        
        {/* Card with Editorial Modernism styling */}
        <div className="bg-card rounded-[6px] p-8 border border-border shadow-editorial-md">
          <SignIn 
            routing="hash"
            fallbackRedirectUrl="/chat"
            appearance={{
              elements: {
                card: "bg-transparent shadow-none",
                headerTitle: "font-serif text-foreground",
                headerSubtitle: "text-muted-foreground",
                socialButtonsBlockButton: "bg-secondary border-border text-foreground hover:bg-secondary/80 rounded-[4px]",
                socialButtonsBlockButtonText: "text-foreground",
                formFieldLabel: "text-foreground text-sm uppercase tracking-wide",
                formFieldInput: "bg-transparent border-0 border-b-2 border-border text-foreground placeholder:text-muted-foreground/50 rounded-none focus:border-accent",
                formButtonPrimary: "bg-accent hover:bg-accent/90 text-accent-foreground rounded-[4px] uppercase tracking-wide font-medium",
                footerActionText: "text-muted-foreground",
                footerActionLink: "text-accent hover:text-accent/80",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground text-xs uppercase tracking-wide",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
