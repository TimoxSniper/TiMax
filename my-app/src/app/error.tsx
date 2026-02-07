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
    // Log error to monitoring service (Sentry in production)
    console.error(error);

    // Glitch effect on mount
    setGlitchActive(true);
    const timer = setTimeout(() => setGlitchActive(false), 1000);
    return () => clearTimeout(timer);
  }, [error]);

  // Funny server error messages
  const funnyMessages = [
    "Unser Server braucht gerade eine Kaffeepause",
    "Die Bits sind durcheinander geraten. Sortieren sie gerade...",
    "Error 500: Der Code hat Existenzaengste.",
    "Unsere KI hat beschlossen, kreativ zu sein. Zu kreativ.",
    "Server-Hamster ist aus dem Rad gefallen",
    "Die Serverraeume sind zu heiss. Ventilatoren unterwegs.",
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
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Animated alert icons in background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        {[...Array(6)].map((_, i) => (
          <AlertTriangle
            key={i}
            className="text-destructive absolute animate-ping"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 15}%`,
              width: "48px",
              height: "48px",
              animationDelay: `${i * 0.5}s`,
              animationDuration: "4s",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl space-y-8 text-center">
        {/* Glitching Editorial Number */}
        <div className="relative space-y-4">
          <h1
            className={`text-destructive font-serif text-[180px] leading-none font-bold tracking-tighter transition-all duration-100 select-none lg:text-[240px] ${
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

        {/* Animated error icons */}
        <div className="flex justify-center gap-4">
          <Zap className="text-destructive h-12 w-12 animate-bounce" />
          <Coffee
            className="text-accent h-12 w-12 animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        {/* Funny Message */}
        <div className="min-h-[200px] space-y-4">
          <h2 className="text-destructive font-serif text-3xl font-semibold lg:text-4xl">
            Houston, wir haben ein Problem
          </h2>
          <p className="text-foreground mx-auto max-w-lg font-sans text-xl leading-relaxed font-medium">
            {message}
          </p>
          <p className="text-muted-foreground mx-auto max-w-md font-sans text-base">
            Keine Sorge, unsere Entwickler wurden automatisch benachrichtigt und trinken vermutlich
            schon Kaffee.
          </p>
          {retryCount > 2 && (
            <p className="text-muted-foreground animate-in fade-in font-sans text-sm italic">
              ({retryCount} Versuche... Sie sind hartnaeckig!)
            </p>
          )}
          {process.env.NODE_ENV === "development" && error.digest && (
            <div className="space-y-2 pt-4">
              <p className="text-muted-foreground bg-secondary inline-block rounded-[4px] px-3 py-2 font-mono text-xs">
                Error ID: {error.digest}
              </p>
              <details className="mx-auto max-w-lg text-left">
                <summary className="text-muted-foreground hover:text-foreground cursor-pointer font-mono text-xs">
                  Stack Trace (Dev Mode)
                </summary>
                <pre className="bg-secondary mt-2 max-h-40 overflow-auto rounded-[4px] p-4 text-left text-[10px]">
                  {error.stack}
                </pre>
              </details>
            </div>
          )}
        </div>

        {/* Animated Actions */}
        <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
          <Button onClick={handleRetry} size="lg" className="group min-h-14 min-w-[200px]">
            <RefreshCw className="mr-2 h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
            Nochmal versuchen
          </Button>
          <Button asChild variant="secondary" size="lg" className="group min-h-14 min-w-[200px]">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Zur Startseite
            </Link>
          </Button>
        </div>

        {/* Progress bar showing "recovery" */}
        <div className="mx-auto max-w-md">
          <div className="bg-secondary h-2 overflow-hidden rounded-[4px]">
            <div
              className="bg-accent h-full animate-pulse"
              style={{
                width: "40%",
              }}
            />
          </div>
          <p className="text-muted-foreground mt-2 font-mono text-xs">Recovery in progress...</p>
        </div>
      </div>
    </div>
  );
}
