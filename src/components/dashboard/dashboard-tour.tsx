
"use client";

import { useState, useLayoutEffect, useEffect } from "react";
import { TourTooltip } from "./tour-tooltip";

const tourSteps = [
  {
    targetId: "tour-dash-1",
    title: "Step 1: Key Metrics at a Glance",
    content: "This top row gives you a high-level summary of your performance, including your simulated Return on Investment (ROI), total portfolio value, and more.",
    placement: "bottom",
  },
  {
    targetId: "tour-dash-2",
    title: "Step 2: Portfolio Performance Chart",
    content: "Visualize your growth over time. This chart tracks your portfolio's value, showing you the ups and downs of your simulated trading journey.",
    placement: "bottom",
  },
  {
    targetId: "tour-dash-3",
    title: "Step 3: Paper Trading Portfolio",
    content: "Here's a quick snapshot of your current holdings. For a more detailed view and to place new trades, head over to the Paper Trading page.",
    placement: "left",
  },
  {
    targetId: "tour-dash-4",
    title: "Step 4: Latest Market News",
    content: "Stay informed with the latest financial news headlines that could be impacting the market.",
    placement: "top",
  },
    {
    targetId: "tour-dash-5",
    title: "Step 5: Featured AI Signal",
    content: "Get a featured AI-driven trading signal right on your dashboard. This card gives you a quick, actionable insight without leaving the page.",
    placement: "left",
  },
];

interface DashboardTourProps {
    onComplete: () => void;
}

export function DashboardTour({ onComplete }: DashboardTourProps) {
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
