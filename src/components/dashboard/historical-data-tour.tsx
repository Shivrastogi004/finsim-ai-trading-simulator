
"use client";

import { useState, useLayoutEffect, useEffect } from "react";
import { TourTooltip } from "./tour-tooltip";

const tourSteps = [
  {
    targetId: "tour-hd-1",
    title: "Step 1: AI-Powered Data Card",
    content: "This card allows you to fetch historical stock data. The AI will also analyze the period and provide sentiment insights.",
    placement: "right",
  },
  {
    targetId: "tour-hd-2",
    title: "Step 2: Define Your Query",
    content: "Enter a stock ticker (e.g., TSLA) and the date range you're interested in analyzing.",
    placement: "bottom",
  },
  {
    targetId: "tour-hd-3",
    title: "Step 3: Fetch Data",
    content: "Click here to run the analysis. The AI will determine the market sentiment for the period and retrieve the data.",
    placement: "top",
  },
  {
    targetId: "tour-hd-4",
    title: "Step 4: View Results",
    content: "The results, including the AI's sentiment explanation and the raw data, will appear here after you fetch them.",
    placement: "bottom",
  },
   {
    targetId: "tour-hd-5",
    title: "Step 5: How It Works",
    content: "This panel provides a quick reminder of the steps involved in using this feature.",
    placement: "left",
  },
];

interface HistoricalDataTourProps {
    onComplete: () => void;
}

export function HistoricalDataTour({ onComplete }: HistoricalDataTourProps) {
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

