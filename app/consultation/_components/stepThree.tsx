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

const DIAGNOSIS_OPTIONS = ['Yes', 'No', 'Unsure'];

const TREATMENT_STATUSES = [
  'Not started treatment',
  'Currently receiving treatment',
  'Completed treatment',
  'Seeking another opinion',
];

interface StepThreeProps {
  onNext?: (data: {
    hasDiagnosis: string;
    diagnosis: string;
    treatmentStatus: string;
    caseId?: string;
  }) => void;
  onBack?: () => void;
  initialData?: {
    hasDiagnosis?: string;
    diagnosis?: string;
    treatmentStatus?: string;
  };
  caseId?: string;
}

export default function StepThreeMedicalDetails({
  onNext,
  onBack,
  initialData = {},
  caseId,
}: StepThreeProps) {
  const [formData, setFormData] = useState({
    hasDiagnosis: initialData.hasDiagnosis || 'Yes',
    diagnosis: initialData.diagnosis || '',
    treatmentStatus: initialData.treatmentStatus || 'Not started treatment',
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({
        ...prev,
        hasDiagnosis: initialData.hasDiagnosis || prev.hasDiagnosis || 'Yes',
        diagnosis: initialData.diagnosis ?? prev.diagnosis ?? '',
        treatmentStatus: initialData.treatmentStatus || prev.treatmentStatus || 'Not started treatment',
      }));
    }
  }, [initialData]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDiagnosisToggle = (opt: string) => {
    setFormData((prev) => ({ ...prev, hasDiagnosis: opt }));
  };

  const handleTreatmentStatusSelect = (status: string) => {
    setFormData((prev) => ({ ...prev, treatmentStatus: status }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('handleSubmit (Step 3) called, formData:', formData);
    setErrorMsg(null);
    setLoading(true);

    try {
      if (caseId) {
        await updatePatientCase(caseId, {
          has_diagnosis: formData.hasDiagnosis,
          diagnosis: formData.diagnosis,
          treatment_status: formData.treatmentStatus,
        });
      }

      if (onNext) {
        onNext({
          ...formData,
          caseId,
        });
      }
    } catch (err: any) {
      console.error('Error in Step 3:', err);
      setErrorMsg(err.message || 'Failed to update medical details. Please try again.');
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
          Medical details &amp; history.
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          Share your confirmed or preliminary medical diagnosis so our team can match you with the right specialist.
        </p>

        {/* Stepper Header Bar */}
        <div className="pt-8 pb-10">
          <div className="flex items-center justify-between relative max-w-2xl mx-auto px-2">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

            {STEPS.map((step) => {
              const isActive = step.id === 3;
              const isPast = step.id < 3;
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

          {/* Do you have a formal diagnosis */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              Do you have an existing medical diagnosis? <span className="text-emerald-600">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DIAGNOSIS_OPTIONS.map((opt) => {
                const isSelected = formData.hasDiagnosis === opt;
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => handleDiagnosisToggle(opt)}
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

          {/* Specific Diagnosis Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800">
              Specific Diagnosis or Condition (if known)
            </label>
            <input
              type="text"
              value={formData.diagnosis}
              onChange={(e) => setFormData((prev) => ({ ...prev, diagnosis: e.target.value }))}
              placeholder="e.g. Stage 2 Breast Cancer, Lumbar Herniation, Knee Osteoarthritis"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Current Treatment Status */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              What is your current treatment status? <span className="text-emerald-600">*</span>
            </label>
            <div className="space-y-2">
              {TREATMENT_STATUSES.map((status) => {
                const isSelected = formData.treatmentStatus === status;
                return (
                  <button
                    type="button"
                    key={status}
                    onClick={() => handleTreatmentStatusSelect(status)}
                    className={`w-full p-3.5 text-xss sm:text-sm font-medium rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-600/20 font-semibold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span>{status}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
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
                  Saving Details...
                </>
              ) : (
                'Continue to Step 4 (Documents)'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
