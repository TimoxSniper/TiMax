"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <Button
      onClick={scrollToTop}
      size="icon-lg"
      className="shadow-editorial-md bg-accent text-accent-foreground fixed right-6 bottom-6 z-40 rounded-[4px] transition-all duration-300 hover:opacity-90"
      aria-label="Nach oben scrollen"
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </Button>
  );
}
