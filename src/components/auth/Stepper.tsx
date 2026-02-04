
import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  steps: string[];
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-center w-full max-w-2xl mx-auto py-10 relative">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isActive = currentStep === stepNumber;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`size-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary text-white'
                    : isActive
                    ? 'bg-primary/20 text-primary border-2 border-primary'
                    : 'bg-gray-100 text-gray-400 border-2 border-transparent'
                }`}
              >
                {isCompleted ? <Check className="size-5" /> : stepNumber}
              </div>
              <span
                className={`absolute -bottom-8 whitespace-nowrap text-xs font-bold ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-4 bg-gray-200 relative -top-0">
                <div
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
