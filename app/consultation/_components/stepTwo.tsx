'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/app/lib/firebase/client';
import { createPatientCase, updatePatientCase } from '@/app/lib/firebase/services';

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
  onNext?: (data: {
    supportType: string;
    healthcareArea: string;
    situationDescription: string;
    caseId?: string;
  }) => void;
  onBack?: () => void;
  initialData?: {
    supportType?: string;
    healthcareArea?: string;
    situationDescription?: string;
  };
  aboutYou?: {
    consultationFor?: string;
    fullName?: string;
    patientName?: string;
    email?: string;
    phone?: string;
    country?: string;
    userId?: string;
  };
  caseId?: string;
}

export default function StepTwoYourSituation({
  onNext,
  onBack,
  initialData = {},
  aboutYou = {},
  caseId,
}: StepTwoProps) {
  const [formData, setFormData] = useState({
    supportType: initialData.supportType || 'Finding the right hospital or specialist',
    healthcareArea: initialData.healthcareArea || 'Orthopedics',
    situationDescription: initialData.situationDescription || '',
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({
        ...prev,
        supportType: initialData.supportType || prev.supportType || 'Finding the right hospital or specialist',
        healthcareArea: initialData.healthcareArea || prev.healthcareArea || 'Orthopedics',
        situationDescription: initialData.situationDescription ?? prev.situationDescription ?? '',
      }));
    }
  }, [initialData]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSupportTypeSelect = (type: string) => {
    setFormData((prev) => ({ ...prev, supportType: type }));
  };

  const handleHealthcareAreaSelect = (area: string) => {
    setFormData((prev) => ({ ...prev, healthcareArea: area }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('handleSubmit called, formData:', formData);
    setErrorMsg(null);
    setLoading(true);

    try {
      const user = auth.currentUser;
      const effectiveUserId = user?.uid || aboutYou?.userId || `patient_${Date.now()}`;
      let activeCaseId = caseId;

      if (activeCaseId) {
        await updatePatientCase(activeCaseId, {
          support_type: formData.supportType,
          healthcare_area: formData.healthcareArea,
          need: formData.healthcareArea || formData.supportType || 'Medical Consultation',
          situation_description: formData.situationDescription,
          situation: formData.situationDescription,
          consultation_for: aboutYou?.consultationFor || 'Myself',
          patient_name: aboutYou?.patientName || aboutYou?.fullName || user?.displayName || 'Patient',
          contact_name: aboutYou?.fullName || user?.displayName || '',
          patient_email: aboutYou?.email || user?.email || '',
          patient_phone: aboutYou?.phone || '',
          country: aboutYou?.country || '',
        });
      } else {
        const newCase = await createPatientCase({
          user_id: effectiveUserId,
          consultation_for: aboutYou?.consultationFor || 'Myself',
          patient_name: aboutYou?.patientName || aboutYou?.fullName || user?.displayName || user?.email?.split('@')[0] || 'Patient',
          contact_name: aboutYou?.fullName || user?.displayName || '',
          patient_email: aboutYou?.email || user?.email || '',
          patient_phone: aboutYou?.phone || '',
          country: aboutYou?.country || '',
          support_type: formData.supportType,
          healthcare_area: formData.healthcareArea,
          need: formData.healthcareArea || formData.supportType || 'Medical Consultation',
          situation_description: formData.situationDescription,
          situation: formData.situationDescription,
          stage: 'Consultation Submitted',
          workflow_stage: 'Consultation Submitted',
          status: 'New',
        });
        activeCaseId = newCase.id;
      }

      if (onNext) {
        onNext({
          ...formData,
          caseId: activeCaseId,
        });
      }
    } catch (err: any) {
      console.error('Error in Step 2:', err);
      setErrorMsg(err.message || 'Failed to save your details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xsss font-semibold rounded-full border border-emerald-100">
          Start Your Healthcare Journey
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
          Tell us about your medical situation.
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          Help our clinical coordinators understand the specific care or treatment support you are seeking.
        </p>

        {/* Stepper Header Bar */}
        <div className="pt-8 pb-10">
          <div className="flex items-center justify-between relative max-w-2xl mx-auto px-2">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

            {STEPS.map((step) => {
              const isActive = step.id === 2;
              const isPast = step.id < 2;
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center group">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xsss font-bold transition-all ${
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
                    className={`mt-2 text-xsss font-medium whitespace-nowrap hidden sm:block ${
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

          {/* Primary Need / Support Type */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              What kind of support are you looking for? <span className="text-emerald-600">*</span>
            </label>
            <div className="space-y-2">
              {SUPPORT_TYPES.map((type) => {
                const isSelected = formData.supportType === type;
                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => handleSupportTypeSelect(type)}
                    className={`w-full p-3.5 text-xsss sm:text-sm font-medium rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-600/20 font-semibold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span>{type}</span>
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

          {/* Healthcare Specialty Area */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              Healthcare / Specialty Area <span className="text-emerald-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {HEALTHCARE_AREAS.map((area) => {
                const isSelected = formData.healthcareArea === area;
                return (
                  <button
                    type="button"
                    key={area}
                    onClick={() => handleHealthcareAreaSelect(area)}
                    className={`p-3 text-xsss sm:text-sm font-medium rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-600/20 font-semibold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span>{area}</span>
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

          {/* Description of situation */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800">
              Describe your current symptoms or diagnosis in your own words
            </label>
            <textarea
              rows={4}
              value={formData.situationDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, situationDescription: e.target.value }))}
              placeholder="e.g. Diagnosed with knee arthritis, seeking second opinion and surgical cost estimate..."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Action Buttons */}
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
                'Continue to Step 3 (Medical Details)'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
