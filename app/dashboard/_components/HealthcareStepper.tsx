'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';

export interface Step {
  number: number;
  label: string;
  href: string;
}

const defaultSteps: Step[] = [
  { number: 1, label: 'Consultation Submitted', href: '/dashboard' },
  { number: 2, label: 'Case Review', href: '/dashboard/case-review' },
  { number: 3, label: 'Hospital Recommendation', href: '/dashboard/recommendations' },
  { number: 4, label: 'Medical Itinerary', href: '/dashboard/medical-itinerary' },
  { number: 5, label: 'Accommodation & Visa', href: '/dashboard/accommodation' },
  { number: 6, label: 'Travel Preparation', href: '/dashboard/travel-preparation' },
  { number: 7, label: 'Treatment & Recovery', href: '/dashboard/treatment-recovery' },
];

interface HealthcareStepperProps {
  steps?: Step[];
  className?: string;
}

export default function HealthcareStepper({
  steps = defaultSteps,
  className = '',
}: HealthcareStepperProps) {
  const pathname = usePathname();

  const activeStep = steps.find((s) => s.href === pathname);
  const currentStepNumber = activeStep ? activeStep.number : 1;

  return (
    <div
      className={`bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 ${className}`}
    >
      <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
        YOUR HEALTHCARE JOURNEY
      </span>

      <div className="overflow-x-auto pb-4 pt-2 -mx-4 sm:mx-0 px-4 sm:px-0 touch-pan-x scrollbar-none">
        <div className="min-w-[680px] sm:min-w-[700px] flex items-center justify-between relative px-4">
          <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-200 -z-0" />
          <div
            className="absolute top-4 left-8 h-0.5 bg-emerald-600 -z-0 transition-all duration-300"
            style={{
              width: `${
                ((currentStepNumber - 1) / (steps.length - 1)) * 92
              }%`,
            }}
          />

          {steps.map((step) => {
            const isCompleted = step.number < currentStepNumber;
            const isActive = step.href === pathname;

            return (
              <Link
                key={step.number}
                href={step.href}
                className="relative z-10 flex flex-col items-center max-w-[90px] sm:max-w-[100px] text-center space-y-2 group cursor-pointer"
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                    isActive
                      ? 'border-emerald-600 text-emerald-700 bg-white ring-4 ring-emerald-50'
                      : isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-gray-200 text-gray-400 bg-white group-hover:border-emerald-400 group-hover:text-emerald-600'
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold leading-tight transition-colors ${
                    isActive
                      ? 'text-emerald-700 font-bold'
                      : isCompleted
                      ? 'text-slate-800 font-medium'
                      : 'text-gray-500 group-hover:text-slate-900'
                  }`}
                >
                  {step.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}