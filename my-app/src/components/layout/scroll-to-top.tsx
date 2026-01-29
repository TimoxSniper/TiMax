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

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!show) return null;

    return (
        <Button
            onClick={scrollToTop}
            size="icon"
            className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-all duration-300 hover:scale-110"
            aria-label="Nach oben scrollen"
        >
            <ArrowUp className="w-5 h-5" aria-hidden="true" />
        </Button>
    );
}
