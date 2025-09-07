
"use client";

import { useState, useLayoutEffect, useEffect } from "react";
import { TourTooltip } from "./tour-tooltip";

const tourSteps = [
  {
    targetId: "tour-pt-1",
    title: "Step 1: Your Account Overview",
    content: "These cards give you a real-time snapshot of your paper trading account, including your total value, cash balance, and today's profit or loss.",
    placement: "bottom",
  },
  {
    targetId: "tour-pt-2",
    title: "Step 2: Your Portfolio",
    content: "This table shows all your current positions. You can see the number of shares you own, the current market value, and your profit or loss for each stock.",
    placement: "bottom",
  },
  {
    targetId: "tour-pt-3",
    title: "Step 3: Place a New Trade",
    content: "Ready to make a move? Click this button to open the trade dialog, where you can buy or sell stocks for your paper portfolio.",
    placement: "left",
  },
];

interface PaperTradingTourProps {
    onComplete: () => void;
}

export function PaperTradingTour({ onComplete }: PaperTradingTourProps) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const currentStep = tourSteps[step];
  
  function debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  useLayoutEffect(() => {
    function updatePosition() {
      const targetElement = document.getElementById(currentStep.targetId);
      if (targetElement) {
        setTargetRect(targetElement.getBoundingClientRect());
      }
    }
    
    const debouncedUpdate = debounce(updatePosition, 100);

    const interval = setInterval(() => {
        const targetElement = document.getElementById(currentStep.targetId);
        if(targetElement) {
            updatePosition();
            clearInterval(interval);
        }
    }, 100);


    window.addEventListener("resize", debouncedUpdate);
    
    return () => {
        clearInterval(interval);
        window.removeEventListener("resize", debouncedUpdate);
    }
  }, [step]);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    }
  }, []);


  const handleNext = () => {
    if (step < tourSteps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!targetRect) return null;
  
  const highlightStyle: React.CSSProperties = {
    position: "absolute",
    top: `${targetRect.top - 4}px`,
    left: `${targetRect.left - 4}px`,
    width: `${targetRect.width + 8}px`,
    height: `${targetRect.height + 8}px`,
    boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
    borderRadius: "8px",
    zIndex: 1000,
    pointerEvents: "none",
    transition: "top 0.3s, left 0.3s, width 0.3s, height 0.3s",
  };


  return (
    <div className="fixed inset-0 z-50">
      <div style={highlightStyle} />
      <TourTooltip
        targetRect={targetRect}
        stepConfig={currentStep}
        onNext={handleNext}
        onSkip={handleSkip}
        isLastStep={step === tourSteps.length - 1}
      />
    </div>
  );
}
