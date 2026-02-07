"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Step {
  id: string;
  label: string;
  duration: number; // in ms
}

const STEPS: Step[] = [
  { id: "upload", label: "Datei wird sicher hochgeladen", duration: 5000 },
  { id: "stt", label: "KI transkribiert Audio (STT)", duration: 220000 }, // 220s - längster Teil
  { id: "analysis", label: "Inhalt wird analysiert", duration: 30000 },
  { id: "save", label: "In Wissensdatenbank gespeichert", duration: 15000 },
];

interface ProcessingStatusProps {
  isProcessing: boolean;
  onComplete?: () => void;
}

export function ProcessingStatus({ isProcessing, onComplete }: ProcessingStatusProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    if (!isProcessing) {
      setCurrentStepIndex(0);
      setCompletedSteps([]);
      return;
    }

    let timeout: NodeJS.Timeout;

    const runSteps = async () => {
      for (let i = 0; i < STEPS.length; i++) {
        setCurrentStepIndex(i);
        await new Promise((resolve) => {
          timeout = setTimeout(resolve, STEPS[i].duration);
        });
        setCompletedSteps((prev) => [...prev, STEPS[i].id]);
      }
      if (onComplete) onComplete();
    };

    runSteps();

    return () => clearTimeout(timeout);
  }, [isProcessing, onComplete]);

  if (!isProcessing) return null;

  return (
    <div className="mt-8 space-y-6">
      <h4 className="text-muted-foreground text-center text-xs font-medium tracking-[0.2em] uppercase">
        Verarbeitungsstatus
      </h4>
      <div className="mx-auto max-w-xs space-y-4">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = currentStepIndex === index && !isCompleted;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : isActive ? (
                  <Loader2 className="text-accent h-5 w-5 animate-spin" />
                ) : (
                  <Circle className="text-muted-foreground/30 h-5 w-5" />
                )}
              </div>
              <span
                className={`text-sm transition-colors duration-300 ${
                  isCompleted
                    ? "text-foreground font-medium"
                    : isActive
                      ? "text-accent font-medium"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
