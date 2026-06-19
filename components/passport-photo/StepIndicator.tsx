import { CheckIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  current: number; // 1-based
}

export default function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    // pt-2 gives the scaled active circle room to breathe without clipping
    <div className="w-full overflow-x-auto pt-2 pb-1">
      <div className="flex items-start justify-center min-w-max mx-auto">
        {steps.map((step, i) => {
          const num = i + 1;
          const done = num < current;
          const active = num === current;

          return (
            <div key={num} className="flex items-start">
              {/* Connector — mt-4 (16px) centres it on the 32px (h-8) circle */}
              {i > 0 && (
                <div
                  className={cn(
                    "mt-4 h-px w-8 sm:w-12 shrink-0 transition-colors duration-300",
                    done ? "bg-primary" : "bg-border"
                  )}
                />
              )}

              {/* Circle + label */}
              <div className="flex flex-col items-center gap-1.5 w-16 sm:w-20">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 text-sm font-semibold select-none",
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : active
                        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-110"
                        : "border-border bg-background text-muted-foreground"
                  )}
                >
                  {done ? <CheckIcon weight="bold" size={13} /> : num}
                </div>

                <span
                  className={cn(
                    "text-[10px] sm:text-xs font-medium whitespace-nowrap leading-tight text-center transition-colors duration-300",
                    active ? "text-foreground font-semibold" : done ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
