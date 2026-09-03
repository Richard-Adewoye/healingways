'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight,
  Loader2,
  CheckCircle2,
  MapPin,
  Lock,
  Star,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { auth } from '@/app/lib/firebase/client';
import { 
  getUserActiveCase, 
  patientSelectHospital,
  getStoredUser,
  DEFAULT_HOSPITALS,
  Hospital,
  PatientCase 
} from '@/app/lib/firebase/services';
import HealthcareStepper from '../_components/HealthcareStepper';

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [activeCase, setActiveCase] = useState<PatientCase | null>(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const stored = getStoredUser();
      const user = auth.currentUser;
      const uid = user?.uid || stored?.uid || null;
      const email = user?.email || stored?.email || null;
      const c = await getUserActiveCase(uid, email);
      if (c) {
        setActiveCase(c);
        setSelectedHospitalId(c.selected_hospital_id || null);
        const recList = (c.recommended_hospitals && c.recommended_hospitals.length > 0)
          ? c.recommended_hospitals
          : DEFAULT_HOSPITALS;
        setHospitals(recList);
      } else {
        setHospitals(DEFAULT_HOSPITALS);
      }
    } catch (err) {
      console.error('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectHospital = async (hosp: Hospital) => {
    if (!activeCase) return;
    setSelecting(hosp.id);
    try {
      await patientSelectHospital(activeCase.id, hosp.id, hosp);
      setSelectedHospitalId(hosp.id);
      await fetchData();
    } catch (err) {
      console.error('Error selecting hospital:', err);
    } finally {
      setSelecting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="w-6 h-6 text-blue-900 animate-spin mr-2" />
        <span className="text-sm font-medium text-slate-600">Loading your hospital recommendations...</span>
      </div>
    );
  }

  // Gating rule: Stage 2 (Case Review) must be accepted before Stage 3 is available
  const isReviewAccepted = !!activeCase?.review_accepted;
  const hasHospitalSelected = !!selectedHospitalId;

  return (
    <div className="p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
            Hospital Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Case {activeCase?.case_number || 'HW-2026-531971'} · Curated accredited hospital options
          </p>
        </div>
        <Link 
          href="/dashboard"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Journey
        </Link>
      </div>

      {/* Healthcare Stepper */}
      <HealthcareStepper />

      {/* Gating Check */}
      {!isReviewAccepted ? (
        <div className="max-w-xl mx-auto my-12 bg-slate-50/90 border border-dashed border-slate-300 rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-200/80 text-slate-500 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">
            Hospital Selection Is Locked
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            In accordance with medical coordination safety guidelines, you must review and confirm your doctor&apos;s clinical evaluation before selecting a hospital.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/case-review"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Go to Case Review</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {hasHospitalSelected && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-900">Hospital Choice Confirmed</p>
                  <p className="text-xs text-emerald-700">
                    Medical itinerary creation is now unlocked. You can view your scheduled treatment timeline.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/medical-itinerary"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>View Medical Itinerary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Hospital Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hospitals.map((hosp) => {
              const isSelected = selectedHospitalId === hosp.id;
              return (
                <div
                  key={hosp.id}
                  className={`bg-white rounded-2xl border p-6 transition-all space-y-5 flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-600/10 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 mb-1.5">
                          <ShieldCheck className="w-3 h-3" /> {hosp.accreditation || 'JCI Accredited'}
                        </span>
                        <h3 className="text-lg font-bold text-blue-900 leading-snug">{hosp.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {hosp.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {hosp.rating || 4.9}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {hosp.description}
                    </p>

                    {/* Specialties */}
                    {hosp.specialties && hosp.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {hosp.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded-md"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Est. Procedure Range</span>
                      <p className="text-xs font-bold text-slate-800">{hosp.estimatedCost || '$6,500 - $8,200'}</p>
                    </div>

                    <button
                      type="button"
                      disabled={selecting === hosp.id}
                      onClick={() => handleSelectHospital(hosp)}
                      className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {selecting === hosp.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Selecting...
                        </>
                      ) : isSelected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Confirmed Choice
                        </>
                      ) : (
                        'Select Hospital'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
