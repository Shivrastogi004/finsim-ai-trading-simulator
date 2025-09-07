
"use client";

import { useState, useLayoutEffect, useEffect } from "react";
import { TourTooltip } from "./tour-tooltip";

const tourSteps = [
  {
    targetId: "tour-ai-signal-1",
    title: "Step 1: The AI Signal Card",
    content: "Each card provides an AI-generated trading signal for a specific stock, like this one for AAPL.",
    placement: "bottom",
  },
  {
    targetId: "tour-ai-signal-2",
    title: "Step 2: The Signal",
    content: "This is the core signal: Buy, Sell, or Hold. It's color-coded for quick identification.",
    placement: "bottom",
  },
  {
    targetId: "tour-ai-signal-3",
    title: "Step 3: Explainable AI (XAI)",
    content: "This is the 'why' behind the signal. Our AI explains the key factors it considered, helping you build trust and learn.",
    placement: "bottom",
  },
  {
    targetId: "tour-ai-signal-4",
    title: "Step 4: Refresh",
    content: "Markets move fast. Click here to fetch the latest, up-to-the-minute signal from the AI.",
    placement: "top",
  },
];

interface AiSignalsTourProps {
    onComplete: () => void;
}

export function AiSignalsTour({ onComplete }: AiSignalsTourProps) {
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

    // Initial check might fail if the card is still loading, so retry
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
