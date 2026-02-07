"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Witty messages that rotate
  const funnyMessages = [
    "Diese Seite hat wohl ihren Karriereplan geaendert.",
    "404: Die Seite ist auf Kaffeepause.",
    "Ups! Diese URL hat gekuendigt.",
    "Die Seite wurde zu einem besseren Angebot weitergezogen.",
    "Hier war mal eine Seite... bevor es cool war.",
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % funnyMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [funnyMessages.length]);

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="border-accent absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full border-4"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div
          className="border-accent absolute right-1/4 bottom-1/4 h-64 w-64 rotate-45 border-4"
          style={{
            transform: `translate(${-mousePos.x}px, ${-mousePos.y}px) rotate(45deg)`,
            transition: "transform 0.3s ease-out",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl space-y-8 text-center">
        {/* Animated Editorial Number */}
        <div
          className="space-y-4"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <h1
            className="text-accent cursor-pointer font-serif text-[180px] leading-none font-bold tracking-tighter transition-all duration-500 select-none lg:text-[240px]"
            style={{
              transform: isHovering
                ? `rotate(-5deg) scale(1.05) translate(${mousePos.x / 2}px, ${mousePos.y / 2}px)`
                : "rotate(0deg) scale(1)",
              textShadow: "8px 8px 0 rgba(154, 111, 79, 0.2)",
            }}
          >
            404
          </h1>
          {/* Animated underline */}
          <div
            className="bg-accent mx-auto h-[3px] transition-all duration-700 ease-out"
            style={{
              width: isHovering ? "200px" : "128px",
            }}
          />
        </div>

        {/* Animated Icon */}
        <div className="flex justify-center">
          <Search
            className="text-accent h-16 w-16 animate-bounce"
            style={{ animationDuration: "3s" }}
          />
        </div>

        {/* Rotating Funny Messages */}
        <div className="min-h-[160px] space-y-4">
          <h2 className="font-serif text-3xl font-semibold lg:text-4xl">Seite nicht gefunden</h2>
          <p
            key={messageIndex}
            className="text-muted-foreground animate-in fade-in slide-in-from-bottom-4 mx-auto max-w-lg font-sans text-lg leading-relaxed duration-700"
          >
            {funnyMessages[messageIndex]}
          </p>
          <p className="text-muted-foreground font-sans text-sm italic">
            Aber keine Sorge, wir helfen Ihnen zurueck auf den richtigen Weg.
          </p>
        </div>

        {/* Actions with hover effects */}
        <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
          <Button asChild size="lg" className="group min-h-14 min-w-[200px]">
            <Link href="/">
              <Home className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Zur Startseite
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="group min-h-14 min-w-[200px]">
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              Zurueck
            </Link>
          </Button>
        </div>

        {/* Subtle animated hint */}
        <p className="text-muted-foreground animate-pulse font-mono text-xs">
          Tipp: Bewege deine Maus ueber die &quot;404&quot;
        </p>
      </div>
    </div>
  );
}
