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

const CARE_OUTSIDE_OPTIONS = ['Yes', 'No', 'Not sure'];

const LOCATION_OPTIONS = [
  'Within my country',
  'West Africa',
  'India',
  'Asia',
  'Arab Region',
  'Open to recommendations',
];

const PRIORITY_OPTIONS = [
  'Treatment cost',
  'Hospital reputation',
  'Distance',
  'Family accommodation',
  'Language support',
  'Speed of access',
];

interface StepFiveProps {
  onNext?: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
  caseId?: string;
}

export default function StepFivePreferences({
  onNext,
  onBack,
  initialData = {},
  caseId,
}: StepFiveProps) {
  const supabase = createClient();

  const [formData, setFormData] = useState({
    careOutsideCountry: initialData.careOutsideCountry || 'Yes',
    preferredLocation: initialData.preferredLocation || 'Within my country',
    priorities: (initialData.priorities || ['Treatment cost']) as string[],
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1. Get user session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User session not found. Please log in or restart from step 1.');
      }

      if (!caseId) {
        throw new Error('Missing case context. Please complete previous steps first.');
      }

      // 2. Persist preferences into Supabase cases table
      const { data: updatedCase, error: dbError } = await supabase
        .from('cases')
        .update({
          care_outside_country: formData.careOutsideCountry,
          preferred_location: formData.preferredLocation,
          priorities: formData.priorities,
          updated_at: new Date().toISOString(),
        })
        .eq('id', caseId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (dbError) throw dbError;

      // 3. Move forward to Step 6
      if (onNext) {
        onNext({
          ...formData,
          caseId: updatedCase.id,
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update preferences. Please try again.');
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
              const isCompleted = step.id < 5;
              const isActive = step.id === 5;

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

      {/* Form Content Card */}
      <div className="max-w-2xl mx-auto space-y-6">
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form id="step-five-form" onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Are you open to receiving care outside your country? */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              Are you open to receiving care outside your country?
            </label>
            <div className="flex flex-wrap gap-2.5">
              {CARE_OUTSIDE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={loading}
                  onClick={() => setFormData((prev) => ({ ...prev, careOutsideCountry: option }))}
                  className={`px-5 py-2 rounded-full text-xs font-semibold transition-all border ${
                    formData.careOutsideCountry === option
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred location */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              Preferred location
            </label>
            <div className="flex flex-wrap gap-2.5">
              {LOCATION_OPTIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  disabled={loading}
                  onClick={() => setFormData((prev) => ({ ...prev, preferredLocation: loc }))}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                    formData.preferredLocation === loc
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* What matters most to you? */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              What matters most to you? (select all that apply)
            </label>
            <div className="flex flex-wrap gap-2.5">
              {PRIORITY_OPTIONS.map((priority) => {
                const isSelected = formData.priorities.includes(priority);
                return (
                  <button
                    key={priority}
                    type="button"
                    disabled={loading}
                    onClick={() => togglePriority(priority)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {priority}
                  </button>
                );
              })}
            </div>
          </div>

        </form>

        {/* Navigation Buttons Row */}
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
            form="step-five-form"
            disabled={loading}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}