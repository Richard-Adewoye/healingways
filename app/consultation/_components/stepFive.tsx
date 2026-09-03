'use client';

import React, { useState, useEffect } from 'react';
import { updatePatientCase } from '@/app/lib/firebase/services';

const STEPS = [
  { id: 1, label: 'About You' },
  { id: 2, label: 'Your Situation' },
  { id: 3, label: 'Medical Details' },
  { id: 4, label: 'Documents' },
  { id: 5, label: 'Preferences' },
  { id: 6, label: 'Consent' },
];

const CARE_OUTSIDE_OPTIONS = ['Yes', 'No', 'Not sure'];

const LOCATION_OPTIONS = [
  'India',
  'Thailand',
  'Turkey',
  'Singapore',
  'United Arab Emirates',
  'Open to recommendations',
];

const PRIORITY_OPTIONS = [
  'Treatment cost',
  'Hospital reputation & JCI accreditation',
  'Distance / Travel time',
  'Family accommodation',
  'Language support & translation',
  'Speed of appointment access',
];

interface StepFiveProps {
  onNext?: (data: {
    careOutsideCountry: string;
    preferredLocation: string;
    priorities: string[];
    caseId?: string;
  }) => void;
  onBack?: () => void;
  initialData?: {
    careOutsideCountry?: string;
    preferredLocation?: string;
    priorities?: string[];
  };
  caseId?: string;
}

export default function StepFivePreferences({
  onNext,
  onBack,
  initialData = {},
  caseId,
}: StepFiveProps) {
  const [formData, setFormData] = useState({
    careOutsideCountry: initialData.careOutsideCountry || 'Yes',
    preferredLocation: initialData.preferredLocation || 'Open to recommendations',
    priorities: (initialData.priorities || ['Treatment cost', 'Hospital reputation & JCI accreditation']) as string[],
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({
        ...prev,
        careOutsideCountry: initialData.careOutsideCountry || prev.careOutsideCountry || 'Yes',
        preferredLocation: initialData.preferredLocation || prev.preferredLocation || 'Open to recommendations',
        priorities: initialData.priorities || prev.priorities || ['Treatment cost', 'Hospital reputation & JCI accreditation'],
      }));
    }
  }, [initialData]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const togglePriority = (priority: string) => {
    setFormData((prev) => {
      const exists = prev.priorities.includes(priority);
      return {
        ...prev,
        priorities: exists
          ? prev.priorities.filter((item) => item !== priority)
          : [...prev.priorities, priority],
      };
    });
  };

  const handleCareOutsideSelect = (opt: string) => {
    setFormData((prev) => ({ ...prev, careOutsideCountry: opt }));
  };

  const handleLocationSelect = (loc: string) => {
    setFormData((prev) => ({ ...prev, preferredLocation: loc }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('handleSubmit (Step 5) called, formData:', formData);
    setErrorMsg(null);
    setLoading(true);

    try {
      if (caseId) {
        await updatePatientCase(caseId, {
          care_outside_country: formData.careOutsideCountry,
          preferred_location: formData.preferredLocation,
          preferred_destination: formData.preferredLocation,
        });
      }

      if (onNext) {
        onNext({
          ...formData,
          caseId,
        });
      }
    } catch (err: any) {
      console.error('Error in Step 5:', err);
      setErrorMsg(err.message || 'Failed to update preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xss font-semibold rounded-full border border-emerald-100">
          Start Your Healthcare Journey
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
          Your travel &amp; care preferences.
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          Help us align hospitals, timelines, and destinations with your budget, schedule, and family needs.
        </p>

        {/* Stepper Header Bar */}
        <div className="pt-8 pb-10">
          <div className="flex items-center justify-between relative max-w-2xl mx-auto px-2">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

            {STEPS.map((step) => {
              const isActive = step.id === 5;
              const isPast = step.id < 5;
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center group">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xss font-bold transition-all ${
                      isActive
                        ? 'border-2 border-emerald-600 bg-white text-emerald-700 ring-4 ring-emerald-50'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 bg-white text-slate-500'
                    }`}
                  >
                    {step.id}
                  </div>
                  <span
                    className={`mt-2 text-xss font-medium whitespace-nowrap hidden sm:block ${
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

      {/* Main Form Card */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-10 mt-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Are you open to traveling abroad */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              Are you willing to travel abroad for medical treatment? <span className="text-emerald-600">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {CARE_OUTSIDE_OPTIONS.map((opt) => {
                const isSelected = formData.careOutsideCountry === opt;
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => handleCareOutsideSelect(opt)}
                    className={`p-3 text-xss sm:text-sm font-medium rounded-xl border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-600/20 font-semibold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Destination */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              Preferred Country or Destination
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {LOCATION_OPTIONS.map((loc) => {
                const isSelected = formData.preferredLocation === loc;
                return (
                  <button
                    type="button"
                    key={loc}
                    onClick={() => handleLocationSelect(loc)}
                    className={`p-3 text-xss sm:text-sm font-medium rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-600/20 font-semibold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span>{loc}</span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <span className="w-1 h-1 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priorities */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              What matters most to you? (Select all that apply)
            </label>
            <div className="space-y-2">
              {PRIORITY_OPTIONS.map((p) => {
                const isSelected = formData.priorities.includes(p);
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => togglePriority(p)}
                    className={`w-full p-3.5 text-xss sm:text-sm font-medium rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-600/20 font-semibold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span>{p}</span>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <span className="text-[10px] leading-none font-bold">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
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
              disabled={loading}
              className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Preferences...
                </>
              ) : (
                'Review & Consent (Step 6)'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
