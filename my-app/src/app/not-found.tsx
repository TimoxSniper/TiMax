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
    <div className="min-h-screen bg-background flex items-center justify-center px-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border-4 border-accent animate-pulse"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 border-4 border-accent rotate-45"
          style={{
            transform: `translate(${-mousePos.x}px, ${-mousePos.y}px) rotate(45deg)`,
            transition: "transform 0.3s ease-out",
          }}
        />
      </div>

      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        {/* Animated Editorial Number */}
        <div
          className="space-y-4"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <h1
            className="font-serif text-[180px] lg:text-[240px] font-bold text-accent leading-none tracking-tighter select-none cursor-pointer transition-all duration-500"
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
            className="h-[3px] bg-accent mx-auto transition-all duration-700 ease-out"
            style={{
              width: isHovering ? "200px" : "128px",
            }}
          />
        </div>

        {/* Animated Icon */}
        <div className="flex justify-center">
          <Search
            className="w-16 h-16 text-accent animate-bounce"
            style={{ animationDuration: "3s" }}
          />
        </div>

        {/* Rotating Funny Messages */}
        <div className="space-y-4 min-h-[160px]">
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold">
            Seite nicht gefunden
          </h2>
          <p
            key={messageIndex}
            className="font-sans text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            {funnyMessages[messageIndex]}
          </p>
          <p className="font-sans text-sm text-muted-foreground italic">
            Aber keine Sorge, wir helfen Ihnen zurueck auf den richtigen Weg.
          </p>
        </div>

        {/* Actions with hover effects */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button
            asChild
            size="lg"
            className="min-w-[200px] min-h-14 group"
          >
            <Link href="/">
              <Home className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Zur Startseite
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="min-w-[200px] min-h-14 group"
          >
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Zurueck
            </Link>
          </Button>
        </div>

        {/* Subtle animated hint */}
        <p className="text-xs text-muted-foreground animate-pulse font-mono">
          Tipp: Bewege deine Maus ueber die &quot;404&quot;
        </p>
      </div>
    </div>
  );
}
