'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';

const STEPS = [
  { id: 1, label: 'About You' },
  { id: 2, label: 'Your Situation' },
  { id: 3, label: 'Medical Details' },
  { id: 4, label: 'Documents' },
  { id: 5, label: 'Preferences' },
  { id: 6, label: 'Consent' },
];

const SUPPORT_TYPES = [
  'Finding the right hospital or specialist',
  'Understanding my medical reports',
  'Seeking medical guidance',
  'Preparing for treatment abroad',
  'Accommodation and logistics support',
  'Visa support',
  'Not sure, I need guidance',
];

const HEALTHCARE_AREAS = [
  'Oncology',
  'Cardiology',
  'Orthopedics',
  'Neurology',
  'Fertility & IVF',
  'General Surgery',
  'Pediatrics',
  'Other / Not Sure',
];

interface StepTwoProps {
  onNext?: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
  caseId?: string; // Optional if passing an existing case draft ID
}

export default function StepTwoYourSituation({
  onNext,
  onBack,
  initialData = {},
  caseId,
}: StepTwoProps) {
  const supabase = createClient();

  const [formData, setFormData] = useState({
    supportType: initialData.supportType || 'Finding the right hospital or specialist',
    healthcareArea: initialData.healthcareArea || '',
    situationDescription: initialData.situationDescription || '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1. Check authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User authentication lost. Please restart step 1.');
      }

      // 2. Persist step data to Supabase (upsert active case draft).
      // Note: `status` is intentionally left unset here — it stays on its
      // enum default ('New'). Whether this case is a finished submission
      // vs. an abandoned draft is tracked by `submitted_at` (set in Step 6),
      // not by a separate 'draft' status value that isn't part of the enum.
      const { data: caseData, error: dbError } = await supabase
        .from('cases')
        .upsert({
          ...(caseId ? { id: caseId } : { case_number: `CASE-${Date.now().toString(36).toUpperCase()}` }),
          user_id: user.id,
          support_type: formData.supportType,
          healthcare_area: formData.healthcareArea || null,
          need: formData.healthcareArea || 'General Guidance',
          situation_description: formData.situationDescription,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // 3. Move to next step with updated payload
      if (onNext) {
        onNext({
          ...formData,
          caseId: caseData.id,
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save your details. Please try again.');
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
              const isCompleted = step.id < 2;
              const isActive = step.id === 2;

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

        <form id="step-two-form" onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Support Type Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              What kind of healthcare support are you looking for? <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2.5">
              {SUPPORT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, supportType: type }))}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border text-left ${
                    formData.supportType === type
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Area of healthcare need */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              Area of healthcare need
            </label>
            <select
              name="healthcareArea"
              value={formData.healthcareArea}
              onChange={(e) => setFormData((prev) => ({ ...prev, healthcareArea: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white text-slate-800"
            >
              <option value="">Select if known</option>
              {HEALTHCARE_AREAS.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Situation Description Textarea */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              Tell us about your healthcare situation <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500">
              Share what you're experiencing, your diagnosis if available, and what support you're looking for.
            </p>
            <textarea
              rows={4}
              required
              value={formData.situationDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, situationDescription: e.target.value }))}
              placeholder="Please describe your situation..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 placeholder:text-slate-400 text-slate-800 resize-y"
            />
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
            form="step-two-form"
            disabled={loading}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}