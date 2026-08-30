'use client';

import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';

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
      fullName: 'ss',
      email: 's@a.com',
      phone: '123',
      country: 'India',
    },
    situation: {
      supportType: 'Finding the right hospital or specialist',
      healthcareArea: 'Orthopedics',
      description: 'as',
    },
    medicalDetails: {
      diagnosed: '—',
      treatmentStatus: '—',
    },
    documents: {
      fileCount: 0,
    },
    preferences: {
      careAbroad: 'Not sure',
      preferredLocation: 'West Africa',
      whatMatters: ['Hospital reputation'],
    },
  },
  caseId,
  onEditStep,
  onBack,
  onSubmit,
}: StepSixProps) {
  const supabase = createClient();

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
      // 1. Authenticate user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User session expired. Please log in again before submitting.');
      }

      if (!caseId) {
        throw new Error('Case ID missing. Please verify earlier steps.');
      }

      const timestamp = new Date().toISOString();

      // 2. Persist consent flags & finalize case submission status.
      // `status` is left untouched (stays 'New') — `submitted_at` is what
      // now marks this case as a completed submission rather than an
      // abandoned draft. See migration_add_intake_fields.sql for why.
      const { error: dbError } = await supabase
        .from('cases')
        .update({
          consent_accurate: consent.confirmAccurate,
          consent_review: consent.consentReview,
          consent_disclaimer: consent.understandDisclaimer,
          submitted_at: timestamp,
          updated_at: timestamp,
        })
        .eq('id', caseId)
        .eq('user_id', user.id);

      if (dbError) throw dbError;

      // 3. Trigger parent callback for final confirmation UI / routing
      if (onSubmit) {
        onSubmit({
          ...consent,
          caseId,
          submittedAt: timestamp,
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit consultation. Please try again.');
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
          Let's understand how we can support you.
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          Every healthcare journey is different. Share some details, and our team will review your needs and guide you toward next steps. Takes about 5 minutes.
        </p>

        {/* Stepper Header Bar */}
        <div className="pt-8 pb-10">
          <div className="flex items-center justify-between relative max-w-2xl mx-auto px-2">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

            {STEPS.map((step) => {
              const isCompleted = step.id < 6;
              const isActive = step.id === 6;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center group">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isActive
                        ? 'border-2 border-emerald-600 bg-white text-emerald-700 ring-4 ring-emerald-50'
                        : 'border border-slate-300 bg-white text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium whitespace-nowrap hidden sm:block ${
                      isActive ? 'text-emerald-700 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-500'
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

      {/* Main Content Card */}
      <div className="max-w-2xl mx-auto space-y-6">
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Review Your Information Container */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-5 sm:p-6 space-y-5 text-xs text-slate-600">
            <h3 className="text-sm font-bold text-slate-800">
              Review your information
            </h3>

            {/* ABOUT YOU */}
            <div className="space-y-1 relative pr-12">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">ABOUT YOU</span>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onEditStep && onEditStep(1)}
                  className="absolute top-0 right-0 font-bold text-blue-900 hover:text-blue-700 transition-colors disabled:opacity-50"
                >
                  Edit
                </button>
              </div>
              <p>{reviewData.aboutYou?.consultationFor} · {reviewData.aboutYou?.fullName}</p>
              <p>{reviewData.aboutYou?.email} · {reviewData.aboutYou?.phone}</p>
              <p>{reviewData.aboutYou?.country}</p>
            </div>

            <hr className="border-emerald-100/80" />

            {/* YOUR SITUATION */}
            <div className="space-y-1 relative pr-12">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">YOUR SITUATION</span>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onEditStep && onEditStep(2)}
                  className="absolute top-0 right-0 font-bold text-blue-900 hover:text-blue-700 transition-colors disabled:opacity-50"
                >
                  Edit
                </button>
              </div>
              <p><strong className="font-semibold text-slate-700">Looking for:</strong> {reviewData.situation?.supportType}</p>
              <p><strong className="font-semibold text-slate-700">Area:</strong> {reviewData.situation?.healthcareArea}</p>
              {reviewData.situation?.description && (
                <p className="italic text-slate-500">"{reviewData.situation.description}"</p>
              )}
            </div>

            <hr className="border-emerald-100/80" />

            {/* MEDICAL DETAILS */}
            <div className="space-y-1 relative pr-12">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">MEDICAL DETAILS</span>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onEditStep && onEditStep(3)}
                  className="absolute top-0 right-0 font-bold text-blue-900 hover:text-blue-700 transition-colors disabled:opacity-50"
                >
                  Edit
                </button>
              </div>
              <p><strong className="font-semibold text-slate-700">Diagnosed:</strong> {reviewData.medicalDetails?.diagnosed}</p>
              <p><strong className="font-semibold text-slate-700">Treatment status:</strong> {reviewData.medicalDetails?.treatmentStatus}</p>
            </div>

            <hr className="border-emerald-100/80" />

            {/* DOCUMENTS */}
            <div className="space-y-1 relative pr-12">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">DOCUMENTS</span>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onEditStep && onEditStep(4)}
                  className="absolute top-0 right-0 font-bold text-blue-900 hover:text-blue-700 transition-colors disabled:opacity-50"
                >
                  Edit
                </button>
              </div>
              <p>{reviewData.documents?.fileCount ? `${reviewData.documents.fileCount} file(s) attached` : 'None attached'}</p>
            </div>

            <hr className="border-emerald-100/80" />

            {/* PREFERENCES */}
            <div className="space-y-1 relative pr-12">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">PREFERENCES</span>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onEditStep && onEditStep(5)}
                  className="absolute top-0 right-0 font-bold text-blue-900 hover:text-blue-700 transition-colors disabled:opacity-50"
                >
                  Edit
                </button>
              </div>
              <p><strong className="font-semibold text-slate-700">Open to care abroad:</strong> {reviewData.preferences?.careAbroad}</p>
              <p><strong className="font-semibold text-slate-700">Preferred location:</strong> {reviewData.preferences?.preferredLocation}</p>
              <p><strong className="font-semibold text-slate-700">What matters most:</strong> {reviewData.preferences?.whatMatters?.join(', ')}</p>
            </div>
          </div>

          {/* Consent Checkboxes */}
          <form id="step-six-form" onSubmit={handleSubmit} className="space-y-4 pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="confirmAccurate"
                disabled={loading}
                checked={consent.confirmAccurate}
                onChange={handleCheckboxChange}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
              />
              <span className="text-xs text-slate-700 group-hover:text-slate-900">
                I confirm the information provided is accurate.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="consentReview"
                disabled={loading}
                checked={consent.consentReview}
                onChange={handleCheckboxChange}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
              />
              <span className="text-xs text-slate-700 group-hover:text-slate-900">
                I consent to HealingWays reviewing my healthcare information to provide coordination support.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="understandDisclaimer"
                disabled={loading}
                checked={consent.understandDisclaimer}
                onChange={handleCheckboxChange}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
              />
              <span className="text-xs text-slate-700 group-hover:text-slate-900">
                I understand HealingWays does not provide medical treatment and does not guarantee outcomes.
              </span>
            </label>
          </form>

        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="text-sm font-bold text-blue-900 hover:text-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            ← Back
          </button>
          <button
            type="submit"
            form="step-six-form"
            disabled={isSubmitDisabled}
            className={`px-8 py-3 font-semibold text-sm rounded-lg transition-colors shadow-sm flex items-center gap-2 ${
              isSubmitDisabled
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Submitting...' : 'Submit Consultation'}
          </button>
        </div>
      </div>
    </div>
  );
}