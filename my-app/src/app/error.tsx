"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, AlertTriangle, Zap, Coffee } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [glitchActive, setGlitchActive] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    console.error(error);

    // Glitch effect on mount
    setGlitchActive(true);
    const timer = setTimeout(() => setGlitchActive(false), 1000);
    return () => clearTimeout(timer);
  }, [error]);

  // Funny server error messages
  const funnyMessages = [
    "Unser Server braucht gerade eine Kaffeepause ☕",
    "Die Bits sind durcheinander geraten. Sortieren sie gerade...",
    "Error 500: Der Code hat Existenzängste.",
    "Unsere KI hat beschlossen, kreativ zu sein. Zu kreativ.",
    "Server-Hamster ist aus dem Rad gefallen 🐹",
    "Die Serverräume sind zu heiß. Ventilatoren unterwegs.",
  ];

  const [message, setMessage] = useState(funnyMessages[0]);

  useEffect(() => {
    setMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
  }, []);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    setGlitchActive(true);
    setTimeout(() => {
      setGlitchActive(false);
      reset();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated alert icons in background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <AlertTriangle
            key={i}
            className="absolute text-destructive animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: "48px",
              height: "48px",
              animationDelay: `${i * 0.5}s`,
              animationDuration: "4s",
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        {/* Glitching Editorial Number */}
        <div className="space-y-4 relative">
          <h1
            className={`font-serif text-8xl lg:text-9xl font-bold text-destructive leading-none tracking-tighter select-none transition-all duration-100 ${
              glitchActive ? "animate-pulse" : ""
            }`}
            style={{
              textShadow: glitchActive
                ? "5px 0 0 rgba(255, 0, 0, 0.5), -5px 0 0 rgba(0, 255, 255, 0.5)"
                : "8px 8px 0 rgba(178, 58, 47, 0.2)",
              transform: glitchActive ? "skewX(-5deg)" : "skewX(0deg)",
            }}
          >
            500
          </h1>
          {/* Animated zigzag underline */}
          <div className="flex justify-center">
            <svg width="150" height="8" className="animate-pulse">
              <path
                d="M 0 4 L 30 1 L 60 7 L 90 1 L 120 7 L 150 4"
                stroke="currentColor"
                className="text-destructive"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Animated error icon */}
        <div className="flex justify-center gap-4">
          <Zap className="w-12 h-12 text-destructive animate-bounce" />
          <Coffee
            className="w-12 h-12 text-accent"
            style={{
              animation: "bounce 2s infinite",
              animationDelay: "0.5s",
            }}
          />
        </div>

        {/* Funny Message */}
        <div className="space-y-4 min-h-[200px]">
          <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-destructive">
            Houston, wir haben ein Problem
          </h2>
          <p className="font-sans text-xl text-foreground max-w-lg mx-auto leading-relaxed font-medium">
            {message}
          </p>
          <p className="font-sans text-base text-muted-foreground max-w-md mx-auto">
            Keine Sorge, unsere Entwickler wurden automatisch benachrichtigt und trinken
            vermutlich schon Kaffee.
          </p>
          {retryCount > 2 && (
            <p className="font-sans text-sm text-muted-foreground italic animate-in fade-in">
              ({retryCount} Versuche... Sie sind hartnäckig! 💪)
            </p>
          )}
          {process.env.NODE_ENV === "development" && error.digest && (
            <div className="pt-4 space-y-2">
              <p className="font-mono text-xs text-muted-foreground bg-secondary px-3 py-2 rounded-[4px] inline-block">
                Error ID: {error.digest}
              </p>
              <details className="text-left max-w-lg mx-auto">
                <summary className="cursor-pointer font-mono text-xs text-muted-foreground hover:text-foreground">
                  Stack Trace (Dev Mode)
                </summary>
                <pre className="mt-2 text-[10px] text-left bg-secondary p-4 rounded-[4px] overflow-auto max-h-40 border border-border">
                  {error.stack}
                </pre>
              </details>
            </div>
          )}
        </div>

        {/* Animated Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button onClick={handleRetry} size="lg" className="min-w-[200px] group">
            <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Nochmal versuchen
          </Button>
          <Button asChild variant="secondary" size="lg" className="min-w-[200px] group">
            <Link href="/">
              <Home className="w-5 h-5 mr-2 group-hover:translate-y-0 transition-transform" />
              Zur Startseite
            </Link>
          </Button>
        </div>

        {/* Progress bar showing "recovery" */}
        <div className="max-w-md mx-auto">
          <div className="h-2 bg-secondary rounded-[4px] overflow-hidden">
            <div
              className="h-full bg-accent animate-pulse"
              style={{
                width: "40%",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-mono">
            Recovery in progress...
          </p>
        </div>
      </div>
    </div>
  );
}
