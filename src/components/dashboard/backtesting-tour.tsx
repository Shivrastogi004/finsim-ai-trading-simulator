
"use client";

import { useState, useLayoutEffect, useEffect } from "react";
import { TourTooltip } from "./tour-tooltip";

const tourSteps = [
  {
    targetId: "tour-step-1",
    title: "Step 1: Define Your Backtest",
    content: "This is the main backtesting card. Here you can choose a stock and a trading strategy to test against historical data.",
    placement: "right",
  },
  {
    targetId: "tour-step-2",
    title: "Step 2: Select a Strategy",
    content: "Click here to choose from a list of pre-defined trading strategies like Moving Average Crossover or RSI.",
    placement: "bottom",
  },
  {
    targetId: "tour-step-3",
    title: "Step 3: Run the Backtest",
    content: "Once you've selected your stock and strategy, click this button to start the simulation.",
    placement: "bottom",
  },
  {
    targetId: "tour-step-4",
    title: "Step 4: How It Works",
    content: "This section provides a quick overview of the backtesting process, from selecting a strategy to getting AI-driven suggestions.",
    placement: "left",
  },
  {
    targetId: "tour-step-5",
    title: "Step 5: View Your Results",
    content: "After running the backtest, your results and the AI's suggestions for improving your strategy will appear here.",
    placement: "bottom",
  },
];

interface BacktestingTourProps {
    onComplete: () => void;
}

export function BacktestingTour({ onComplete }: BacktestingTourProps) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const currentStep = tourSteps[step];
  
  // Debounce function to limit how often a function can run.
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

    updatePosition();
    window.addEventListener("resize", debouncedUpdate);
    
    return () => {
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
