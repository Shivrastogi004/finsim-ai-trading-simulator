"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TourStep {
  targetId: string;
  title: string;
  content: string;
  placement: "top" | "bottom" | "left" | "right";
}

interface TourTooltipProps {
  targetRect: DOMRect;
  stepConfig: TourStep;
  onNext: () => void;
  onSkip: () => void;
  isLastStep: boolean;
}

export function TourTooltip({
  targetRect,
  stepConfig,
  onNext,
  onSkip,
  isLastStep,
}: TourTooltipProps) {
  const getPosition = () => {
    const tooltipHeight = 150; // Approximate height, adjust as needed
    const tooltipWidth = 300; // Approximate width, adjust as needed
    const gap = 16;

    let top = 0;
    let left = 0;

    switch (stepConfig.placement) {
      case "bottom":
        top = targetRect.bottom + gap;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
      case "top":
        top = targetRect.top - tooltipHeight - gap;
        left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        break;
      case "right":
        top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
        left = targetRect.right + gap;
        break;
      case "left":
        top = targetRect.left - tooltipWidth - gap;
        break;
    }
     // Clamp values to be within viewport
    top = Math.max(gap, Math.min(top, window.innerHeight - tooltipHeight - gap - 50)); // added buffer
    left = Math.max(gap, Math.min(left, window.innerWidth - tooltipWidth - gap));

    return { top, left };
  };

  const { top, left } = getPosition();

  const style: React.CSSProperties = {
    position: "absolute",
    top: `${top}px`,
    left: `${left}px`,
    width: "300px",
    zIndex: 1001,
    transition: "top 0.3s, left 0.3s",
  };

  const arrowClasses = {
    "bottom": "bottom-full left-1/2 -translate-x-1/2 border-x-transparent border-b-card",
    "top": "top-full left-1/2 -translate-x-1/2 border-x-transparent border-t-card rotate-180",
    "right": "right-full top-1/2 -translate-y-1/2 border-y-transparent border-r-card",
    "left": "left-full top-1/2 -translate-y-1/2 border-y-transparent border-l-card",
  }

  return (
    <div
      style={style}
      className="bg-card p-4 rounded-lg shadow-2xl border animate-in fade-in-50 relative"
    >
      <div className={cn("absolute w-0 h-0 border-8 border-solid", arrowClasses[stepConfig.placement])} />
      <h4 className="font-bold text-lg mb-2">{stepConfig.title}</h4>
      <p className="text-sm text-muted-foreground mb-4">{stepConfig.content}</p>
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={onSkip}>
          Skip Tour
        </Button>
        <Button size="sm" onClick={onNext}>
          {isLastStep ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}
