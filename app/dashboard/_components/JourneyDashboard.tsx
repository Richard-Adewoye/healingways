'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Plus, 
  Check, 
  ArrowRight,
  Upload,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';
import HealthcareStepper from './HealthcareStepper';
import { auth } from '@/app/lib/firebase/client';
import { 
  subscribeToUserActiveCase,
  getCurrentUserProfile, 
  getStoredUser, 
  saveCaseDocument, 
  getJourneyStepNumber, 
  PatientCase 
} from '@/app/lib/firebase/services';

interface UploadedDocument {
  id?: string;
  name: string;
  created_at?: string;
  size?: number | string;
}

export default function JourneyDashboard() {
  const pathname = usePathname();

  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [activeCase, setActiveCase] = useState<PatientCase | null>(null);

  // Document management states
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let authUnsubscribe = () => {};
    let caseUnsubscribe = () => {};

    authUnsubscribe = auth.onAuthStateChanged(async (user) => {
      const stored = getStoredUser();
      const effectiveUid = user?.uid || stored?.uid || null;
      const effectiveEmail = user?.email || stored?.email || null;

      if (effectiveUid || effectiveEmail) {
        setUserId(effectiveUid);
        getCurrentUserProfile().then((profile) => {
          const name = profile?.fullName || stored?.fullName || user?.displayName || user?.email?.split('@')[0] || 'Patient';
          setUserName(name);
        });

        caseUnsubscribe();
        caseUnsubscribe = subscribeToUserActiveCase(effectiveUid, effectiveEmail, (foundCase) => {
          if (foundCase) {
            setActiveCase(foundCase);
            if (foundCase.documents && foundCase.documents.length > 0) {
              setDocuments(
                foundCase.documents.map((d) => ({
                  id: d.id,
                  name: d.name,
                  created_at: d.createdAt,
                  size: d.fileSize,
                }))
              );
            }
          }
          setLoadingUser(false);
        });
      } else {
        setUserName('');
        setActiveCase(null);
        setLoadingUser(false);
      }
    });

    return () => {
      authUnsubscribe();
      caseUnsubscribe();
    };
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const currentUserId = userId || 'patient';
      const currentCaseId = activeCase?.id;

      if (!currentCaseId) {
        setUploadError('Please submit a consultation intake to create a case before uploading documents.');
        setUploading(false);
        return;
      }

      const saved = await saveCaseDocument({
        caseId: currentCaseId,
        userId: currentUserId,
        name: file.name,
        fileSize: file.size,
        fileType: file.type,
        category: 'Patient Upload',
      });

      setDocuments((prev) => [
        { id: saved.id, name: saved.name, created_at: saved.createdAt, size: saved.fileSize },
        ...prev,
      ]);
      setUploadSuccess(`Successfully uploaded "${file.name}"`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while uploading. Please try again.';
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  };

  const cleanName = userName.trim();
  const userInitial = cleanName ? cleanName.charAt(0).toUpperCase() : 'P';
  const firstName = cleanName ? cleanName.split(' ')[0] : 'there';
  const isItineraryPage = pathname === '/dashboard/medical-itinerary';

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
      />

      {/* Header Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/90 pb-4 sm:pb-5 gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          My Healthcare Journey
        </h1>
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-blue-700 hover:text-blue-900 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden rounded-md px-2 py-1 transition-colors"
          >
            ← Back to Website
          </Link>
          <div className="flex items-center gap-3">
            <button 
              className="p-2 text-slate-600 hover:text-slate-900 active:bg-slate-200 relative rounded-full hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-700" />
            </button>
            <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0 uppercase">
              {loadingUser && !userName ? (
                <div className="w-4 h-4 rounded-full skeleton" />
              ) : (
                userInitial
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {loadingUser && !userName ? (
            <div className="space-y-2">
              <div className="h-8 w-48 rounded-md skeleton" />
              <div className="h-4 w-72 rounded-md skeleton" />
            </div>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
                {isItineraryPage 
                  ? 'Your Medical Itinerary' 
                  : `Good to see you, ${firstName}.`
                }
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {activeCase?.case_number 
                  ? `Case #${activeCase.case_number} · Stage: ${(activeCase.workflow_stage || activeCase.stage) === 'Consultation Submitted' ? 'Consultation Intake (Under Review)' : (activeCase.workflow_stage || activeCase.stage)}`
                  : 'No active consultation on file. Submit an intake to begin your clinical journey.'}
              </p>
            </>
          )}
        </div>
        <Link 
          href="/consultation"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-xs hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden transition-all w-full sm:w-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Consultation
        </Link>
      </div>

      {/* Feedback Alerts */}
      {uploadError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-900 text-xs sm:text-sm shadow-2xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
      {uploadSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900 text-xs sm:text-sm shadow-2xs">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Reusable Journey Stepper */}
      <HealthcareStepper activeCase={activeCase} />

      {/* Active Stage Action & Guidance Banner */}
      {(() => {
        if (!activeCase) {
          return (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  Action Required: Consultation Intake
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Start Your Medical Consultation
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Submit your clinical details, treatment preferences, and medical records to receive senior doctor evaluations and accredited hospital options.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href="/consultation"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden transition-all"
                >
                  Start Consultation Intake
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        }

        const stepNum = getJourneyStepNumber(activeCase.workflow_stage || activeCase.stage);
        
        if (stepNum === 1) {
          return (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Stage 1: Consultation Intake Under Review
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Medical Board Evaluating Case File
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Our clinical team is currently analyzing your medical records and intake diagnosis. Case Review will unlock as soon as your clinical assessment is ready.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href="/dashboard/messages"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-sm rounded-xl transition-all shadow-xs"
                >
                  Message Coordinator
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        }

        if (stepNum === 2) {
          return (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50/60 border border-emerald-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Action Required: Clinical Case Review Ready
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Doctor Evaluation Complete
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Your Senior Medical assessment has been published. Review and accept the findings to unlock hospital recommendations.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href="/dashboard/case-review"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-xs"
                >
                  Review Clinical Assessment
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        }

        if (stepNum === 3) {
          return (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50/60 border border-blue-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Action Required: Hospital Recommendations
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Accredited Hospital Options Available
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Tailored hospital options matching your medical requirements are ready. Select your preferred facility to unlock your medical itinerary.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href="/dashboard/recommendations"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-sm rounded-xl transition-all shadow-xs"
                >
                  Choose Preferred Hospital
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        }

        if (stepNum === 4) {
          return (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50/60 border border-purple-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                  Action Required: Medical Itinerary
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Care Schedule &amp; Procedure Timeline
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Your personalized clinical schedule has been prepared. Review and confirm the care timeline to unlock accommodation and visa support.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href="/dashboard/medical-itinerary"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white font-bold text-sm rounded-xl transition-all shadow-xs"
                >
                  Review Medical Itinerary
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        }

        if (stepNum === 5) {
          return (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  Action Required: Accommodation &amp; Visa Support
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Lodging &amp; Medical Visa Arrangements
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Your hotel suite partner details and visa invitation letters are prepared. Confirm your accommodation plan to proceed to travel preparation.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href="/dashboard/accommodation"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white font-bold text-sm rounded-xl transition-all shadow-xs"
                >
                  Confirm Accommodation &amp; Visa
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        }

        if (stepNum === 6) {
          return (
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50/60 border border-teal-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-900">
                  <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                  Action Required: Travel Preparation
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Flight Logistics &amp; Travel Checklist
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Review your airport transfer schedules, packing requirements, and flight details to activate your Treatment &amp; Recovery monitoring portal.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href="/dashboard/travel-preparation"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-bold text-sm rounded-xl transition-all shadow-xs"
                >
                  Complete Travel Preparation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        }

        return (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50/60 border border-emerald-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Active: Treatment &amp; Recovery Monitoring
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Clinical Care in Progress
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Your medical journey is active. Access your clinical logs, treatment updates, and recovery rehabilitation milestones.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/dashboard/treatment-recovery"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-xs"
              >
                Open Treatment Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        );
      })()}

      {/* 2x2 Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Dynamic Care Coordinator Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
              ASSIGNED CARE COORDINATOR
            </span>
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-base shrink-0 shadow-xs">
                {activeCase?.coordinator_name ? activeCase.coordinator_name.charAt(0) : 'S'}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {activeCase?.coordinator_name || 'Sarah James'}
                </h4>
                <p className="text-xs text-slate-600 font-medium">Patient Care Coordinator &amp; Clinical Lead</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Available Monday – Friday, 8:00 AM – 6:00 PM EST for urgent questions and hospital coordination.
            </p>
          </div>
          <Link 
            href="/dashboard/messages"
            className="inline-flex items-center justify-center px-4 py-2.5 border border-emerald-600 text-emerald-800 hover:bg-emerald-50 active:bg-emerald-100 font-bold text-xs sm:text-sm rounded-xl transition-all w-full sm:w-auto self-start focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Send Message
          </Link>
        </div>

        {/* Dynamic Case Summary Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 hover:border-slate-300 transition-all">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
            CASE SUMMARY
          </span>
          {activeCase ? (
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 pt-1">
              <p><strong className="text-slate-900 font-bold">Case ID:</strong> {activeCase.case_number}</p>
              <p><strong className="text-slate-900 font-bold">Healthcare Need:</strong> {activeCase.need}</p>
              <p><strong className="text-slate-900 font-bold">Current Stage:</strong> <span className="font-bold text-emerald-800">{(activeCase.workflow_stage || activeCase.stage) === 'Consultation Submitted' ? 'Consultation Intake (Under Review)' : (activeCase.workflow_stage || activeCase.stage)}</span></p>
              <p><strong className="text-slate-900 font-bold">Status:</strong> {activeCase.status}</p>
              {activeCase.diagnosis && (
                <p><strong className="text-slate-900 font-bold">Diagnosis:</strong> {activeCase.diagnosis}</p>
              )}
            </div>
          ) : (
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 py-3">
              <p>No active case registered for your account yet.</p>
              <Link 
                href="/consultation" 
                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold"
              >
                Submit Consultation Intake →
              </Link>
            </div>
          )}
        </div>

        {/* Medical Documents Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
              MEDICAL DOCUMENTS
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 active:text-emerald-950 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md px-1.5 py-0.5"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" /> Upload File
                </>
              )}
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {documents.length > 0 ? (
              documents.map((doc, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs sm:text-sm hover:bg-slate-100/70 transition-colors">
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">{doc.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium shrink-0 bg-white px-2 py-0.5 rounded-md border border-slate-200">Verified</span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center bg-slate-50/80 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs sm:text-sm">
                No documents uploaded yet. Add diagnostic reports or imaging to accelerate your review.
              </div>
            )}
          </div>
        </div>

        {/* Quick Next Action Card */}
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-2xl shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              CURRENT REQUIRED ACTION
            </span>
            <h4 className="text-lg font-bold text-white">
              {!activeCase
                ? 'Start Medical Consultation Intake'
                : activeCase.workflow_stage === 'Consultation Submitted'
                ? 'Doctor Evaluating Medical Records'
                : activeCase.workflow_stage === 'Case Review'
                ? 'Review Clinical Doctor Findings'
                : activeCase.workflow_stage === 'Hospital Recommendation'
                ? 'Select Your Hospital Option'
                : activeCase.workflow_stage === 'Medical Itinerary'
                ? 'Confirm Your Treatment Itinerary'
                : activeCase.workflow_stage === 'Accommodation & Visa'
                ? 'Review Accommodation & Visa'
                : activeCase.workflow_stage === 'Travel Preparation'
                ? 'Complete Travel Readiness Checklist'
                : 'Follow Active Recovery Progress'}
            </h4>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {!activeCase
                ? 'Submit your medical intake details and diagnostic records to begin your guided clinical journey.'
                : 'HealingWays requires sequential confirmation to protect your health and schedule before moving to subsequent steps.'}
            </p>
          </div>

          <Link
            href={
              !activeCase
                ? '/consultation'
                : activeCase.workflow_stage === 'Case Review'
                ? '/dashboard/case-review'
                : activeCase.workflow_stage === 'Hospital Recommendation'
                ? '/dashboard/recommendations'
                : activeCase.workflow_stage === 'Medical Itinerary'
                ? '/dashboard/medical-itinerary'
                : activeCase.workflow_stage === 'Accommodation & Visa'
                ? '/dashboard/accommodation'
                : activeCase.workflow_stage === 'Travel Preparation'
                ? '/dashboard/travel-preparation'
                : activeCase.workflow_stage === 'Treatment & Recovery'
                ? '/dashboard/treatment-recovery'
                : '/dashboard/case-review'
            }
            className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer self-start focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>{!activeCase ? 'Start Consultation' : 'Proceed to Active Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
