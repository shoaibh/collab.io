"use client";
import { useTourCurrentStep } from "@/features/workspaces/store/use-tour-current-step";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

export const TourGuide = ({
  steps,
  isOpen,
  onClose,
}: {
  steps: {
    selector: string;
    title: string;
    content: string;
  }[];
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [currentStep, setCurrentStep] = useTourCurrentStep();
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && steps[currentStep]) {
      const element = document.querySelector(steps[currentStep].selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        // Position tooltip based on element location
        setTooltipPosition({
          top: rect.bottom + scrollTop + 10,
          left: rect.left + scrollLeft + rect.width / 2,
        });

        // Add highlight class to current element
        element.classList.add("tour-highlight");
        // Scroll element into view if needed
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    // Cleanup highlight
    return () => {
      if (steps[currentStep]) {
        const element = document.querySelector(steps[currentStep].selector);
        if (element) {
          element.classList.remove("tour-highlight");
        }
      }
    };
  }, [currentStep, isOpen, steps]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    setCurrentStep(0);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* Tooltip */}
      <div
        className="fixed z-50 w-[300px] bg-white rounded-lg shadow-xl"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        {/* Close button */}
        <button onClick={onClose} className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100">
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="p-4">
          {/* <div className="text-sm font-medium text-gray-900 mb-2">
            Step {currentStep + 1} of {steps.length}
          </div> */}
          <h3 className="text-lg font-semibold mb-2">{steps[currentStep].title}</h3>
          <p className="text-gray-600 mb-4">{steps[currentStep].content}</p>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              // disabled={currentStep === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              skip
            </button>
            <button onClick={handleNext} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
              {currentStep === steps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
