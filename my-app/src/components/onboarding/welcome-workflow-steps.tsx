/**
 * Welcome Workflow Steps Component
 *
 * Displays the 3-step workflow visualization on the welcome page.
 * Uses Editorial Modernism design with bronze accent circles.
 */

import { Upload, Sparkles, MessageSquare } from 'lucide-react';
import { WORKFLOW_STEPS } from '@/lib/onboarding/constants';

const iconMap = {
  Upload: Upload,
  Sparkles: Sparkles,
  MessageSquare: MessageSquare,
} as const;

export function WelcomeWorkflowSteps() {
  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
      {WORKFLOW_STEPS.map((step, index) => {
        const Icon = iconMap[step.icon as keyof typeof iconMap];

        return (
          <div key={index} className="space-y-4 text-center">
            {/* Bronze Circle Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <Icon className="h-8 w-8 text-accent" />
            </div>

            {/* Title */}
            <h3 className="font-sans text-lg font-medium">{step.title}</h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
