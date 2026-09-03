'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  FileText, 
  Clock, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  Lock,
  Building2
} from 'lucide-react';
import { auth } from '@/app/lib/firebase/client';
import { 
  getUserActiveCase, 
  patientAcceptCaseReview,
  getStoredUser,
  PatientCase 
} from '@/app/lib/firebase/services';
import HealthcareStepper from '../_components/HealthcareStepper';

export default function PatientCaseReviewPage() {
  const [caseDetails, setCaseDetails] = useState<PatientCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [confirmedCheck, setConfirmedCheck] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCaseDetails = useCallback(async () => {
    setLoading(true);

    try {
      const stored = getStoredUser();
      const user = auth.currentUser;
      const uid = user?.uid || stored?.uid || null;
      const email = user?.email || stored?.email || null;
      const c = await getUserActiveCase(uid, email);
      setCaseDetails(c);
      if (c?.review_accepted) {
        setConfirmedCheck(true);
      }
    } catch (err: any) {
      console.error('Error fetching case:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCaseDetails();
  }, [fetchCaseDetails]);

  const handleAcceptReview = async () => {
    if (!caseDetails || !confirmedCheck) return;
    setAccepting(true);
    setErrorMsg(null);

    try {
      await patientAcceptCaseReview(caseDetails.id);
      await fetchCaseDetails();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to accept review. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="w-6 h-6 text-blue-900 animate-spin mr-2" />
        <span className="text-sm font-medium text-slate-600">Loading your clinical case review...</span>
      </div>
    );
  }

  const reviewAvailable = !!caseDetails?.review_text;
  const isAccepted = !!caseDetails?.review_accepted;

  return (
    <div className="p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
            Case Review &amp; Clinical Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {caseDetails?.case_number ? `Case #${caseDetails.case_number}` : 'Consultation'} · Evaluated by Senior Medical Board
          </p>
        </div>
        <Link 
          href="/dashboard"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Journey
        </Link>
      </div>

      {/* Stepper Header */}
      <HealthcareStepper />

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Doctor's Assessment */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center">
                  MD
                </div>
                <div>
                  <h3 className="text-base font-bold text-blue-900">Dr. K. Mehta &amp; Clinical Board</h3>
                  <p className="text-xs text-slate-500">Orthopedic &amp; Surgical Evaluation Board</p>
                </div>
              </div>
              {isAccepted ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Accepted &amp; Confirmed
                </span>
              ) : reviewAvailable ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100">
                  <Clock className="w-3.5 h-3.5" /> Action Required
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                  Under Evaluation
                </span>
              )}
            </div>

            {/* Assessment Text */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Medical Evaluation &amp; Treatment Assessment
              </h4>
              {reviewAvailable ? (
                <div className="p-4 sm:p-5 bg-slate-50 rounded-xl text-slate-700 text-sm leading-relaxed whitespace-pre-line border border-slate-100">
                  {caseDetails?.review_text}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-xl space-y-2">
                  <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                  <h5 className="text-sm font-semibold text-slate-700">Doctors Are Reviewing Your Records</h5>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Your medical coordinator is coordinating with partner hospital specialists. Clinical review notes will appear here shortly.
                  </p>
                </div>
              )}
            </div>

            {/* Confirmation Box (if review is present) */}
            {reviewAvailable && (
              <div className="pt-4 border-t space-y-4">
                {isAccepted ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-emerald-800">You confirmed this medical review</p>
                      <p className="text-[11px] text-emerald-700">
                        Hospital recommendations are now unlocked for your case.
                      </p>
                    </div>
                    <Link
                      href="/dashboard/recommendations"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <span>View Hospitals</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={confirmedCheck}
                        onChange={(e) => setConfirmedCheck(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span>
                        I have read and understood the clinical review notes provided by the medical team, and I agree to proceed to hospital selection.
                      </span>
                    </label>

                    <button
                      type="button"
                      disabled={!confirmedCheck || accepting}
                      onClick={handleAcceptReview}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {accepting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Confirming Review...
                        </>
                      ) : (
                        <>
                          <span>Accept Doctor&apos;s Review &amp; Unlock Hospitals</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Case Summary & Gated Next Stage Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Case Parameters
            </h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <p><strong className="text-slate-800">Need:</strong> {caseDetails?.need || 'Consultation'}</p>
              <p><strong className="text-slate-800">Specialty:</strong> {caseDetails?.healthcare_area || 'Orthopedics'}</p>
              <p><strong className="text-slate-800">Diagnosis:</strong> {caseDetails?.diagnosis || 'Specified in intake'}</p>
              <p><strong className="text-slate-800">Destination Preference:</strong> {caseDetails?.preferred_location || 'Open'}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-slate-700">
              {isAccepted ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Lock className="w-5 h-5 text-slate-400" />}
              <h4 className="text-sm font-bold">Next Stage: Hospital Recommendations</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isAccepted
                ? 'Your coordinator has matched accredited hospitals based on your verified medical assessment.'
                : 'Hospital recommendations remain locked until you accept the doctor\'s medical review above.'}
            </p>
            {isAccepted && (
              <Link
                href="/dashboard/recommendations"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 pt-1"
              >
                <span>Select Hospital</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
