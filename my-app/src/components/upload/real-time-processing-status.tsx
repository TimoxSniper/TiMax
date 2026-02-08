"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Loader2, AlertCircle } from "lucide-react";
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

interface RealTimeProcessingStatusProps {
  isProcessing: boolean;
  uploadId?: string; // ID to track the specific upload
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export function RealTimeProcessingStatus({
  isProcessing,
  uploadId,
  onComplete,
  onError,
}: RealTimeProcessingStatusProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState(false);

  // If we have an uploadId, try to connect to real-time updates
  useEffect(() => {
    if (!uploadId || !isProcessing) return;

    // Try to establish a connection to a real-time updates endpoint
    try {
      // This would connect to a server-sent events endpoint if available
      // For now, we'll simulate real-time updates based on the uploadId
      setRealTimeUpdates(true);

      // Simulate polling for status updates if SSE is not available
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/uploads/${uploadId}`);
          const data = await response.json();

          if (data.success && data.upload) {
            const { status, error_message } = data.upload;

            if (error_message) {
              setError(error_message);
              if (onError) onError(error_message);
              return;
            }

            // Map the actual status to our step progression
            switch (status) {
              case "completed":
                // Mark all steps as completed
                setCompletedSteps(STEPS.map((step) => step.id));
                setCurrentStepIndex(STEPS.length - 1);
                if (onComplete) onComplete();
                clearInterval(interval);
                break;
              case "processing":
                // Determine which step we're on based on timing
                // In a real implementation, the backend would provide more specific status info
                break;
              case "failed":
                setError("Upload failed");
                if (onError) onError("Upload failed");
                clearInterval(interval);
                break;
            }
          }
        } catch (err) {
          console.error("Error fetching upload status:", err);
        }
      }, 2000); // Poll every 2 seconds

      return () => clearInterval(interval);
    } catch (err) {
      console.error("Could not establish real-time connection:", err);
      // Fall back to timer-based approach
      setRealTimeUpdates(false);
    }
  }, [uploadId, isProcessing, onComplete, onError]);

  // Timer-based progression when no real-time updates are available
  useEffect(() => {
    if (!isProcessing || realTimeUpdates) return;

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
  }, [isProcessing, onComplete, realTimeUpdates]);

  if (!isProcessing && !error) return null;

  return (
    <div className="mt-8 space-y-6">
      <h4 className="text-muted-foreground text-center text-xs font-medium tracking-[0.2em] uppercase">
        Verarbeitungsstatus
      </h4>
      <div className="mx-auto max-w-xs space-y-4">
        {error ? (
          <div className="text-destructive flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        ) : (
          STEPS.map((step, index) => {
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
          })
        )}
      </div>
      {realTimeUpdates && (
        <div className="text-center">
          <span className="text-muted-foreground text-xs italic">
            Echtzeit-Statusaktualisierungen aktiv
          </span>
        </div>
      )}
    </div>
  );
}
