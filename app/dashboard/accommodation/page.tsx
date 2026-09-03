'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Bed, 
  Loader2, 
  CheckCircle2, 
  Lock, 
  FileCheck,
  Building2,
  FileText,
  ArrowRight,
  ShieldCheck,
  Plane
} from 'lucide-react';
import { auth } from '@/app/lib/firebase/client';
import { 
  getUserActiveCase, 
  patientConfirmAccommodationAndVisa,
  getStoredUser,
  PatientCase 
} from '@/app/lib/firebase/services';
import HealthcareStepper from '../_components/HealthcareStepper';

export default function AccommodationPage() {
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [activeCase, setActiveCase] = useState<PatientCase | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const stored = getStoredUser();
      const user = auth.currentUser;
      const uid = user?.uid || stored?.uid || null;
      const email = user?.email || stored?.email || null;
      const c = await getUserActiveCase(uid, email);
      setActiveCase(c);
    } catch (err) {
      console.error('Error loading accommodation & visa details:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleConfirm = async () => {
    if (!activeCase) return;
    setConfirming(true);
    try {
      await patientConfirmAccommodationAndVisa(activeCase.id);
      await fetchData();
    } catch (err) {
      console.error('Error confirming accommodation & visa:', err);
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="w-6 h-6 text-blue-900 animate-spin mr-2" />
        <span className="text-sm font-medium text-slate-600">Loading accommodation and visa details...</span>
      </div>
    );
  }

  // Gating rule: Step 4 (Medical Itinerary) must be confirmed first
  const isItineraryConfirmed = !!activeCase?.itinerary_confirmed_by_patient;
  const isAccomConfirmed = !!activeCase?.accommodation_visa_confirmed_by_patient;

  const accommodationText = activeCase?.accommodation_details || `Hotel Partner: Somerset Grand Serviced Suites (500m from Hospital)
Room Type: Deluxe Executive 1-Bedroom Suite with kitchen & accessible bathroom
Duration: 12 Nights (Pre-admission & Post-op Recovery)
Amenities: Daily sanitized housekeeping, wheelchair accessible elevators, 24/7 on-call coordinator, complimentary hospital shuttle.`;

  const visaText = activeCase?.visa_details || `Visa Category: Medical Visa (Type M) - Priority Expedited Stream
Invitation Letter: Hospital Medical Visa Invitation Letter generated and certified with government health registry.
Embassy Status: Approved for e-Medical Visa processing (Est. turnaround: 48-72 hrs). Dedicated visa liaison assigned.`;

  return (
    <div className="p-4 sm:p-8 md:p-10 max-w-7xl mx-auto w-full font-sans space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
            Accommodation &amp; Visa Logistics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Case {activeCase?.case_number || 'HW-2026-531971'} · Tailored for patient comfort and seamless travel
          </p>
        </div>
        <Link 
          href="/dashboard"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Journey
        </Link>
      </div>
      
      {/* Stepper */}
      <HealthcareStepper />

      {/* Gating Check */}
      {!isItineraryConfirmed ? (
        <div className="max-w-xl mx-auto my-12 bg-slate-50/90 border border-dashed border-slate-300 rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-200/80 text-slate-500 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">
            Accommodation &amp; Visa Is Locked
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Accommodation and visa assistance are prepared based on your exact medical itinerary dates. Please confirm your Medical Itinerary first.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/medical-itinerary"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Confirm Medical Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Accommodation Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b pb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-blue-900">Hospital-Adjacent Suite</h3>
                  <p className="text-xs text-slate-500">Reserved for medical recovery</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line border border-slate-100">
                {accommodationText}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              <ShieldCheck className="w-4 h-4" /> Barrier-free access &amp; sterile sanitation verified
            </div>
          </div>

          {/* Visa Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b pb-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-blue-900">Medical Visa Stream</h3>
                  <p className="text-xs text-slate-500">Official hospital documentation</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line border border-slate-100">
                {visaText}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 bg-blue-50 p-3 rounded-xl border border-blue-100">
              <ShieldCheck className="w-4 h-4" /> Hospital visa reference code verified
            </div>
          </div>

          {/* Bottom Confirmation Banner */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            {isAccomConfirmed ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">Accommodation &amp; Visa Plan Confirmed</h4>
                    <p className="text-xs text-emerald-700">
                      Your travel preparation checklist and flight coordination stage are now unlocked.
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/travel-preparation"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Go to Travel Preparation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                  Please review the hotel details and visa documents. Confirming locks in your reservation rate and issues your formal embassy letter.
                </p>
                <button
                  type="button"
                  disabled={confirming}
                  onClick={handleConfirm}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer shrink-0"
                >
                  {confirming ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Confirming Plans...
                    </>
                  ) : (
                    <>
                      <span>Confirm Accommodation &amp; Visa</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
