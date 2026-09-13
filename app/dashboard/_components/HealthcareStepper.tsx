'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check, Lock } from 'lucide-react';
import { auth } from '@/app/lib/firebase/client';
import { 
  getUserActiveCase, 
  getJourneyStepNumber, 
  getStoredUser, 
  PatientCase 
} from '@/app/lib/firebase/services';

export interface Step {
  number: number;
  label: string;
  href: string;
}

const defaultSteps: Step[] = [
  { number: 1, label: 'Consultation Intake', href: '/dashboard' },
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
  activeCase?: PatientCase | null;
  journeyStage?: number | string;
}

export default function HealthcareStepper({
  steps = defaultSteps,
  className = '',
  activeCase: initialCase,
  journeyStage,
}: HealthcareStepperProps) {
  const pathname = usePathname();
  const [fetchedCase, setFetchedCase] = useState<PatientCase | null>(null);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  const caseRecord = initialCase !== undefined ? initialCase : fetchedCase;

  useEffect(() => {
    if (initialCase !== undefined) {
      return;
    }

    let isMounted = true;
    async function loadCase() {
      try {
        const stored = getStoredUser();
        const user = auth.currentUser;
        const uid = user?.uid || stored?.uid || null;
        const email = user?.email || stored?.email || null;
        const c = await getUserActiveCase(uid, email);
        if (isMounted && c) {
          setFetchedCase(c);
        }
      } catch (err) {
        console.warn('Could not load case for stepper:', err);
      }
    }
    loadCase();

    return () => {
      isMounted = false;
    };
  }, [initialCase]);

  // Compute progression stage in medical journey (1 to 7, or 0 if no consultation)
  const hasActiveCase = !!caseRecord;
  const actualStageNumber = journeyStage
    ? typeof journeyStage === 'number'
      ? journeyStage
      : getJourneyStepNumber(journeyStage)
    : caseRecord
    ? getJourneyStepNumber(caseRecord.workflow_stage || caseRecord.stage)
    : 0;

  // Max unlocked step in the journey
  const maxUnlockedStep = actualStageNumber > 0 ? actualStageNumber : 1;

  const currentStageStepObj = actualStageNumber > 0
    ? steps.find((s) => s.number === actualStageNumber) || steps[0]
    : null;

  return (
    <div
      className={`bg-white p-5 sm:p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
            HEALTHCARE JOURNEY
          </span>
          {actualStageNumber > 0 && currentStageStepObj ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Stage {actualStageNumber} of 7: {currentStageStepObj.label}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
              Consultation Intake Pending
            </span>
          )}
        </div>

        {caseRecord?.case_number && (
          <span className="text-xs font-medium text-slate-500">
            Case Ref: <span className="font-bold text-slate-800">{caseRecord.case_number}</span>
          </span>
        )}
      </div>

      {lockedNotice && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs sm:text-sm flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="font-medium">{lockedNotice}</span>
          </div>
          <button
            onClick={() => setLockedNotice(null)}
            className="text-amber-800 hover:text-amber-950 font-bold ml-3 p-1 cursor-pointer"
            aria-label="Dismiss notice"
          >
            ✕
          </button>
        </div>
      )}

      <div className="overflow-x-auto pb-4 pt-2 -mx-4 sm:mx-0 px-4 sm:px-0 touch-pan-x">
        <div className="min-w-[680px] sm:min-w-[700px] flex items-center justify-between relative px-4">
          <div className="absolute top-4 left-8 right-8 h-1 bg-slate-100 -z-0 rounded-full" />
          <div
            className="absolute top-4 left-8 h-1 bg-emerald-600 -z-0 transition-all duration-300 rounded-full"
            style={{
              width: actualStageNumber > 0
                ? `${((Math.min(actualStageNumber, steps.length) - 1) / (steps.length - 1)) * 92}%`
                : '0%',
            }}
          />

          {steps.map((step) => {
            const isCompleted = actualStageNumber > 0 && step.number < actualStageNumber;
            const isCurrentJourneyStage = actualStageNumber > 0 && step.number === actualStageNumber;
            const isCurrentPage = step.href === pathname;
            const isUnlocked = hasActiveCase ? step.number <= maxUnlockedStep : step.number === 1;

            const handleClick = (e: React.MouseEvent) => {
              if (!hasActiveCase && step.number > 1) {
                e.preventDefault();
                setLockedNotice('Please submit your consultation intake to unlock the stages of your healthcare journey.');
                return;
              }
              if (!isUnlocked) {
                e.preventDefault();
                setLockedNotice(
                  `Step ${step.number} (${step.label}) is locked. Complete Step ${actualStageNumber} (${currentStageStepObj?.label || 'Intake'}) to progress.`
                );
              }
            };

            return (
              <Link
                key={step.number}
                href={!hasActiveCase && step.number === 1 ? '/consultation' : step.href}
                onClick={handleClick}
                className={`relative z-10 flex flex-col items-center max-w-[90px] sm:max-w-[100px] text-center space-y-2 group transition-all focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden rounded-xl p-1 ${
                  isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
                aria-label={`Step ${step.number}: ${step.label} ${isCompleted ? '(Completed)' : isCurrentJourneyStage ? '(Current Stage)' : isUnlocked ? '(Unlocked)' : '(Locked)'}`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 transition-all ${
                    isCurrentPage
                      ? 'border-emerald-600 text-emerald-800 bg-white ring-4 ring-emerald-100 shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : isCurrentJourneyStage
                      ? 'border-blue-600 text-blue-800 bg-white ring-4 ring-blue-100 shadow-xs'
                      : 'border-slate-300 text-slate-400 bg-white'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : !isUnlocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    step.number
                  )}
                </div>

                <div className="flex flex-col items-center">
                  <span
                    className={`text-[11px] sm:text-xs font-semibold leading-tight transition-colors ${
                      isCurrentPage
                        ? 'text-emerald-800 font-bold'
                        : isCurrentJourneyStage
                        ? 'text-blue-900 font-bold'
                        : isCompleted
                        ? 'text-slate-800 font-medium'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  {isCurrentJourneyStage && (
                    <span className="inline-block mt-0.5 text-[9px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-1.5 py-0.2 rounded-xs">
                      Active
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
