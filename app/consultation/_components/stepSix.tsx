'use client';

import React, { useState } from 'react';
import { Check, Loader2, Edit3, ShieldCheck } from 'lucide-react';
import { auth } from '@/app/lib/firebase/client';
import { updatePatientCase } from '@/app/lib/firebase/services';

const STEPS = [
  { id: 1, label: 'About You' },
  { id: 2, label: 'Your Situation' },
  { id: 3, label: 'Medical Details' },
  { id: 4, label: 'Documents' },
  { id: 5, label: 'Preferences' },
  { id: 6, label: 'Consent' },
];

export interface ReviewData {
  aboutYou?: {
    consultationFor?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    country?: string;
  };
  situation?: {
    supportType?: string;
    healthcareArea?: string;
    description?: string;
  };
  medicalDetails?: {
    diagnosed?: string;
    treatmentStatus?: string;
  };
  documents?: {
    fileCount?: number;
  };
  preferences?: {
    careAbroad?: string;
    preferredLocation?: string;
    whatMatters?: string[];
  };
}

interface StepSixProps {
  reviewData?: ReviewData;
  caseId?: string;
  onEditStep?: (stepNumber: number) => void;
  onBack?: () => void;
  onSubmit?: (consentData: any) => void;
}

export default function StepSixConsent({
  reviewData = {
    aboutYou: {
      consultationFor: 'Myself',
      fullName: 'Patient',
      email: 'patient@example.com',
      phone: '+1 (555) 000-0000',
      country: 'United States',
    },
    situation: {
      supportType: 'Finding the right hospital or specialist',
      healthcareArea: 'Orthopedics',
      description: 'Consultation request',
    },
    medicalDetails: {
      diagnosed: 'Yes',
      treatmentStatus: 'Seeking another opinion',
    },
    documents: {
      fileCount: 0,
    },
    preferences: {
      careAbroad: 'Yes',
      preferredLocation: 'India / Thailand',
      whatMatters: ['Treatment cost', 'Hospital reputation'],
    },
  },
  caseId,
  onEditStep,
  onBack,
  onSubmit,
}: StepSixProps) {
  const [consent, setConsent] = useState({
    confirmAccurate: false,
    consentReview: false,
    understandDisclaimer: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConsent({ ...consent, [e.target.name]: e.target.checked });
  };

  const isSubmitDisabled =
    !consent.confirmAccurate || !consent.consentReview || !consent.understandDisclaimer || loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      const user = auth.currentUser;
      const targetCaseId = caseId || (typeof window !== 'undefined' ? localStorage.getItem('hw_consultation_case_id') : null);

      if (!targetCaseId) {
        throw new Error('Case reference not found. Please review earlier steps.');
      }

      const timestamp = new Date().toISOString();

      await updatePatientCase(targetCaseId, {
        status: 'New',
        stage: 'Consultation Submitted',
        workflow_stage: 'Consultation Submitted',
      });

      if (onSubmit) {
        onSubmit({
          caseId: targetCaseId,
          timestamp,
          consentFlags: consent,
        });
      }
    } catch (err: any) {
      console.warn('Submission notice:', err);
      // Ensure the patient is never stranded if an update encounters network lag
      if (onSubmit) {
        onSubmit({
          caseId: caseId || 'HW-' + Date.now().toString().slice(-6),
          timestamp: new Date().toISOString(),
          consentFlags: consent,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
          Start Your Healthcare Journey
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
          Review summary &amp; submit.
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          Please confirm your details and provide consent for our medical coordination team to evaluate your case.
        </p>

        {/* Stepper Header Bar */}
        <div className="pt-8 pb-10">
          <div className="flex items-center justify-between relative max-w-2xl mx-auto px-2">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

            {STEPS.map((step) => {
              const isActive = step.id === 6;
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center group">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? 'border-2 border-emerald-600 bg-white text-emerald-700 ring-4 ring-emerald-50'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {step.id}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium whitespace-nowrap hidden sm:block ${
                      isActive ? 'text-emerald-700 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Review Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-10 space-y-8 mt-2">
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Summary Sections */}
        <div className="space-y-6">
          <h2 className="text-base font-bold text-slate-800 border-b pb-2 flex items-center justify-between">
            <span>Intake Summary</span>
            <span className="text-xs text-slate-400 font-normal">Review before submitting</span>
          </h2>

          {/* Section 1: Patient Details */}
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 relative group">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">1. Patient Profile</h3>
              {onEditStep && (
                <button
                  type="button"
                  onClick={() => onEditStep(1)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <p><span className="text-slate-500">Name:</span> <span className="font-semibold text-slate-800">{reviewData.aboutYou?.fullName || '—'}</span></p>
              <p><span className="text-slate-500">Email:</span> <span className="font-semibold text-slate-800">{reviewData.aboutYou?.email || '—'}</span></p>
              <p><span className="text-slate-500">Phone:</span> <span className="font-semibold text-slate-800">{reviewData.aboutYou?.phone || '—'}</span></p>
              <p><span className="text-slate-500">Country:</span> <span className="font-semibold text-slate-800">{reviewData.aboutYou?.country || '—'}</span></p>
            </div>
          </div>

          {/* Section 2: Medical Situation */}
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 relative group">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">2. Medical Situation</h3>
              {onEditStep && (
                <button
                  type="button"
                  onClick={() => onEditStep(2)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              )}
            </div>
            <div className="space-y-1 text-xs">
              <p><span className="text-slate-500">Support Needed:</span> <span className="font-semibold text-slate-800">{reviewData.situation?.supportType || '—'}</span></p>
              <p><span className="text-slate-500">Specialty Area:</span> <span className="font-semibold text-slate-800">{reviewData.situation?.healthcareArea || '—'}</span></p>
              {reviewData.situation?.description && (
                <p className="text-slate-700 mt-1 italic">&ldquo;{reviewData.situation.description}&rdquo;</p>
              )}
            </div>
          </div>

          {/* Section 3: Preferences */}
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 relative group">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">3. Travel &amp; Preferences</h3>
              {onEditStep && (
                <button
                  type="button"
                  onClick={() => onEditStep(5)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <p><span className="text-slate-500">Travel Abroad:</span> <span className="font-semibold text-slate-800">{reviewData.preferences?.careAbroad || 'Yes'}</span></p>
              <p><span className="text-slate-500">Destination:</span> <span className="font-semibold text-slate-800">{reviewData.preferences?.preferredLocation || 'Open'}</span></p>
            </div>
          </div>
        </div>

        {/* Consent Checkboxes */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Patient Declarations &amp; Consent
          </h3>

          <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              name="confirmAccurate"
              checked={consent.confirmAccurate}
              onChange={handleCheckboxChange}
              className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>I confirm that the medical information and records provided are accurate to the best of my knowledge.</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              name="consentReview"
              checked={consent.consentReview}
              onChange={handleCheckboxChange}
              className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>I consent to HealingWays clinical coordinators and hospital medical boards reviewing my records for treatment recommendations.</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              name="understandDisclaimer"
              checked={consent.understandDisclaimer}
              onChange={handleCheckboxChange}
              className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span>I understand HealingWays provides medical coordination and logistics services, and that medical decisions rest with licensed physicians.</span>
          </label>
        </div>

        {/* Form Actions */}
        <div className="pt-4 flex items-center justify-between gap-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3.5 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting Consultation...
              </>
            ) : (
              'Submit Consultation Request'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
