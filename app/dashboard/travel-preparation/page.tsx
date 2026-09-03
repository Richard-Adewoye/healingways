'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  Plus, 
  Send, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  Plane,
  Lock,
  Luggage,
  ShieldCheck,
  Check
} from 'lucide-react';
import { auth } from '@/app/lib/firebase/client';
import { 
  getUserActiveCase, 
  patientConfirmTravel,
  getStoredUser,
  PatientCase 
} from '@/app/lib/firebase/services';
import HealthcareStepper from '../_components/HealthcareStepper';

export default function TravelPreparationPage() {
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [activeCase, setActiveCase] = useState<PatientCase | null>(null);

  const [checklist, setChecklist] = useState({
    passport: true,
    medicalRecords: true,
    medications: true,
    insurance: true,
  });

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
      console.error('Error loading travel preparation:', err);
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
      await patientConfirmTravel(activeCase.id);
      await fetchData();
    } catch (err) {
      console.error('Error confirming travel plan:', err);
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="w-6 h-6 text-blue-900 animate-spin mr-2" />
        <span className="text-sm font-medium text-slate-600">Loading your travel preparation...</span>
      </div>
    );
  }

  // Gating rule: Step 5 (Accommodation & Visa) must be confirmed first
  const isAccomConfirmed = !!activeCase?.accommodation_visa_confirmed_by_patient;
  const isTravelConfirmed = !!activeCase?.confirmed_by_patient;

  const flightText = activeCase?.flight_details || `Flight: Qatar Airways QR-702 (Direct Comfort / Extra Legroom Assigned)
Departure: San Francisco (SFO) → Transit Doha (DOH) → Chennai (MAA)
Airport VIP Concierge: Dedicated airport escort with motorized cart and wheelchair assistance upon touchdown.
Ground Transfer: Private climate-controlled medical van from Chennai Airport directly to Somerset Grand Suites.`;

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 pb-4 sm:pb-5 gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
            Travel Preparation &amp; Flight Logistics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Case {activeCase?.case_number || 'HW-2026-531971'} · Safe journey clearance and arrival assistance
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
      {!isAccomConfirmed ? (
        <div className="max-w-xl mx-auto my-12 bg-slate-50/90 border border-dashed border-slate-300 rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-200/80 text-slate-500 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">
            Travel Preparation Is Locked
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Travel preparation and airport transfer bookings become available once you have confirmed your Accommodation &amp; Visa details.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/accommodation"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Confirm Accommodation &amp; Visa</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Flight Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-blue-900">Flight &amp; Ground Logistics Plan</h3>
                  <p className="text-xs text-slate-500">Curated for low physical strain and continuous comfort</p>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line border border-slate-100 font-mono">
                {flightText}
              </div>

              {isTravelConfirmed ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-900">Travel Readiness Confirmed</p>
                      <p className="text-[11px] text-emerald-700">
                        Final clinical stage unlocked: Treatment &amp; Recovery monitoring.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/treatment-recovery"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <span>View Treatment &amp; Recovery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-xs text-slate-600">
                    Confirm your departure plan so our airport ground host can meet you at arrival gate.
                  </p>
                  <button
                    type="button"
                    disabled={confirming}
                    onClick={handleConfirm}
                    className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {confirming ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Confirming Readiness...
                      </>
                    ) : (
                      <>
                        <span>Confirm Travel &amp; Advance to Treatment</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Pre-Travel Checklist */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Luggage className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-blue-900">Pre-Flight Checklist</h3>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.passport}
                    onChange={(e) => setChecklist({ ...checklist, passport: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-medium text-slate-700">Valid Passport (6+ mos validity)</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.medicalRecords}
                    onChange={(e) => setChecklist({ ...checklist, medicalRecords: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-medium text-slate-700">Physical Copies of MRI / Scans</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.medications}
                    onChange={(e) => setChecklist({ ...checklist, medications: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-medium text-slate-700">Original Prescription Medications</span>
                </label>
                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.insurance}
                    onChange={(e) => setChecklist({ ...checklist, insurance: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-medium text-slate-700">Travel Medical Insurance Policy</span>
                </label>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl text-[11px] text-emerald-800 leading-relaxed flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>24/7 International Emergency Helpline: +1 (800) 555-CARE</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
