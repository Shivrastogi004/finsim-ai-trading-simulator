
"use client";

import { useState, useLayoutEffect, useEffect } from "react";
import { TourTooltip } from "./tour-tooltip";

const tourSteps = [
  {
    targetId: "tour-sentiment-1",
    title: "Step 1: The Sentiment Card",
    content: "Each card analyzes news sentiment for a specific stock. It provides a quick look at how the market feels about it.",
    placement: "bottom",
  },
  {
    targetId: "tour-sentiment-2",
    title: "Step 2: Sentiment Score",
    content: "This is the overall sentiment, ranging from positive to negative. The score and icon give you an at-a-glance summary.",
    placement: "bottom",
  },
  {
    targetId: "tour-sentiment-3",
    title: "Step 3: Correlation",
    content: "This metric indicates how closely the stock's price movement has correlated with the news sentiment.",
    placement: "bottom",
  },
  {
    targetId: "tour-sentiment-4",
    title: "Step 4: AI Summary",
    content: "The AI provides a brief explanation of the sentiment analysis, giving you the context behind the numbers.",
    placement: "top",
  },
    {
    targetId: "tour-sentiment-5",
    title: "Step 5: Data Sources",
    content: "Our sentiment analysis isn't just from one place. We pull from news headlines, social media, and financial blogs for a well-rounded view.",
    placement: "top",
  },
];

interface SentimentTourProps {
    onComplete: () => void;
}

export function SentimentTour({ onComplete }: SentimentTourProps) {
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
