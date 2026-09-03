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
  AlertCircle,
  X
} from 'lucide-react';
import HealthcareStepper from './HealthcareStepper';
import { auth } from '@/app/lib/firebase/client';
import { 
  getUserActiveCase, 
  getCurrentUserProfile, 
  getStoredUser,
  saveCaseDocument, 
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
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let unsubscribe = () => {};

    async function loadData() {
      setLoadingUser(true);

      unsubscribe = auth.onAuthStateChanged(async (user) => {
        const stored = getStoredUser();
        const effectiveUid = user?.uid || stored?.uid || null;
        const effectiveEmail = user?.email || stored?.email || null;

        if (effectiveUid || effectiveEmail) {
          setUserId(effectiveUid);
          const profile = await getCurrentUserProfile();
          const name = profile?.fullName || stored?.fullName || user?.displayName || user?.email?.split('@')[0] || 'Patient';
          setUserName(name);

          const foundCase = await getUserActiveCase(effectiveUid, effectiveEmail);
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
        } else {
          setUserName('');
          setActiveCase(null);
        }
        setLoadingUser(false);
      });
    }

    loadData();

    return () => unsubscribe();
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
    } catch (err: any) {
      setUploadError(err.message || 'An error occurred while uploading. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const cleanName = userName.trim();
  const userInitial = cleanName ? cleanName.charAt(0).toUpperCase() : 'P';
  const firstName = cleanName ? cleanName.split(' ')[0] : 'there';
  const isItineraryPage = pathname === '/dashboard/medical-itinerary';

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200/80 pb-4 sm:pb-5 gap-3 sm:gap-4">
        <h1 className="text-lg sm:text-xl font-bold text-blue-900">
          My Healthcare Journey
        </h1>
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Website
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:text-gray-700 relative rounded-full hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-sm shrink-0 uppercase">
              {loadingUser && !userName ? '...' : userInitial}
            </div>
          </div>
        </div>
      </div>

      {/* Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
            {isItineraryPage 
              ? 'Your Medical Itinerary' 
              : `Good to see you, ${loadingUser && !userName ? '...' : firstName}.`
            }
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {activeCase?.case_number 
              ? `Case #${activeCase.case_number} · Stage: ${activeCase.workflow_stage || activeCase.stage}`
              : 'Consultation active and under clinical review.'}
          </p>
        </div>
        <Link 
          href="/consultation"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors w-full sm:w-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Consultation
        </Link>
      </div>

      {/* Feedback Alerts */}
      {uploadError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
      {uploadSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs sm:text-sm">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Reusable Journey Stepper */}
      <HealthcareStepper />

      {/* 2x2 Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Dynamic Care Coordinator Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 sm:space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              ASSIGNED CARE COORDINATOR
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-sm shrink-0">
                {activeCase?.coordinator_name ? activeCase.coordinator_name.charAt(0) : 'S'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900">
                  {activeCase?.coordinator_name || 'Sarah James'}
                </h4>
                <p className="text-xs text-gray-500">Patient Care Coordinator &amp; Clinical Lead</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Available Monday – Friday, 8:00 AM – 6:00 PM EST for questions and hospital coordination.
            </p>
          </div>
          <Link 
            href="/dashboard/messages"
            className="inline-block text-center px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors w-full sm:w-auto self-start"
          >
            Send Message
          </Link>
        </div>

        {/* Dynamic Case Summary Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 sm:space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            CASE SUMMARY
          </span>
          {activeCase ? (
            <div className="space-y-2 text-xs text-gray-600">
              <p><strong className="text-slate-800 font-semibold">Case ID:</strong> {activeCase.case_number}</p>
              <p><strong className="text-slate-800 font-semibold">Healthcare Need:</strong> {activeCase.need}</p>
              <p><strong className="text-slate-800 font-semibold">Current Stage:</strong> <span className="font-bold text-emerald-700">{activeCase.workflow_stage || activeCase.stage}</span></p>
              <p><strong className="text-slate-800 font-semibold">Status:</strong> {activeCase.status}</p>
              {activeCase.diagnosis && (
                <p><strong className="text-slate-800 font-semibold">Diagnosis:</strong> {activeCase.diagnosis}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2 text-xs text-gray-500 py-2">
              <p>No active case registered.</p>
              <Link 
                href="/consultation" 
                className="inline-block text-emerald-700 font-semibold hover:underline"
              >
                Submit Consultation Intake →
              </Link>
            </div>
          )}
        </div>

        {/* Medical Documents Section */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              MEDICAL DOCUMENTS
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer disabled:opacity-50"
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

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {documents.length > 0 ? (
              documents.map((doc, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-800 truncate">{doc.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">Verified</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center bg-slate-50/60 rounded-xl text-slate-400 text-xs">
                No documents uploaded yet. Add diagnostic reports or scans to accelerate your review.
              </div>
            )}
          </div>
        </div>

        {/* Quick Next Action Card */}
        <div className="bg-emerald-900 text-white p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              CURRENT REQUIRED ACTION
            </span>
            <h4 className="text-base font-bold">
              {activeCase?.workflow_stage === 'Consultation Submitted'
                ? 'Doctor Evaluating Medical Records'
                : activeCase?.workflow_stage === 'Case Review'
                ? 'Review Clinical Doctor Findings'
                : activeCase?.workflow_stage === 'Hospital Recommendation'
                ? 'Select Your Hospital Option'
                : activeCase?.workflow_stage === 'Medical Itinerary'
                ? 'Confirm Your Treatment Itinerary'
                : activeCase?.workflow_stage === 'Accommodation & Visa'
                ? 'Review Accommodation & Visa'
                : activeCase?.workflow_stage === 'Travel Preparation'
                ? 'Complete Travel Readiness Checklist'
                : 'Follow Active Recovery Progress'}
            </h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              HealingWays requires sequential confirmation to protect your health and schedule before moving to subsequent steps.
            </p>
          </div>

          <Link
            href={
              activeCase?.workflow_stage === 'Case Review'
                ? '/dashboard/case-review'
                : activeCase?.workflow_stage === 'Hospital Recommendation'
                ? '/dashboard/recommendations'
                : activeCase?.workflow_stage === 'Medical Itinerary'
                ? '/dashboard/medical-itinerary'
                : activeCase?.workflow_stage === 'Accommodation & Visa'
                ? '/dashboard/accommodation'
                : activeCase?.workflow_stage === 'Travel Preparation'
                ? '/dashboard/travel-preparation'
                : activeCase?.workflow_stage === 'Treatment & Recovery'
                ? '/dashboard/treatment-recovery'
                : '/dashboard/case-review'
            }
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer self-start"
          >
            <span>Proceed to Active Step</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
