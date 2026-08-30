'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  FileText, 
  MessageSquare, 
  Clock, 
  AlertCircle,
  Loader2,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { createClient } from '../../utils/supabase/client';
import HealthcareStepper from '../_components/HealthcareStepper';

interface PatientCaseDetails {
  id: string;
  caseId: string;
  stage: string;
  workflowStage: string;
  healthcareNeed: string;
  coordinatorName: string;
  coordinatorRole: string;
  lastUpdated: string;
  createdAt: string;
  reviewText: string | null;
  reviewAccepted: boolean;
  reviewAcceptedAt: string | null;
  documentCount: number;
}

interface SupabaseCaseResponse {
  id: string;
  case_number?: string;
  stage?: string;
  workflow_stage?: string;
  healthcare_need?: string;
  need?: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  coordinator_id?: string;
  review_text?: string | null;
  review_accepted?: boolean;
  review_accepted_at?: string | null;
  coordinator?: { full_name?: string | null } | { full_name?: string | null }[] | null;
}

const STAGES = [
  'New Lead',
  'Case Review',
  'Recommendation Ready',
  'Treatment Scheduled',
  'Completed'
];

function unwrap<T>(val: T | T[] | null | undefined): T | null {
  if (!val) return null;
  return Array.isArray(val) ? val[0] ?? null : val;
}

export default function PatientCaseReviewPage() {
  const supabase = createClient();

  const [caseDetails, setCaseDetails] = useState<PatientCaseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  // Fetch real case data for logged-in patient
  const fetchCaseDetails = useCallback(async () => {
    setLoading(true);
    try {
      // Get logged-in user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('cases')
        .select(`
          id,
          case_number,
          stage,
          workflow_stage,
          need,
          created_at,
          updated_at,
          user_id,
          coordinator_id,
          review_text,
          review_accepted,
          review_accepted_at,
          coordinator:profiles!coordinator_id ( full_name )
        `)
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching case:', error.message);
      }

      const caseData = data as SupabaseCaseResponse | null;

      if (caseData) {
        // Fetch document statistics for this patient
        const { count: totalDocs } = await supabase
          .from('documents')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const coordinator = unwrap(caseData.coordinator);

        const formattedCase: PatientCaseDetails = {
          id: caseData.id,
          caseId: caseData.case_number || `HW-2026-${caseData.id.slice(0, 6).toUpperCase()}`,
          stage: caseData.stage || 'Case Review',
          workflowStage: caseData.workflow_stage || 'New Consultation',
          healthcareNeed: caseData.need || 'Orthopedic Consultation',
          coordinatorName: coordinator?.full_name || 'Sarah James',
          coordinatorRole: 'Patient Care Coordinator',
          lastUpdated: new Date(caseData.updated_at || Date.now()).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          createdAt: new Date(caseData.created_at || Date.now()).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          reviewText: caseData.review_text ?? null,
          reviewAccepted: caseData.review_accepted ?? false,
          reviewAcceptedAt: caseData.review_accepted_at ?? null,
          documentCount: totalDocs || 0
        };

        setCaseDetails(formattedCase);
      } else {
        // Fallback state if case record isn't initialized yet
        setCaseDetails({
          id: 'demo-123',
          caseId: 'HW-2026-531971',
          stage: 'Case Review',
          workflowStage: 'New Consultation',
          healthcareNeed: 'Orthopedic Guidance',
          coordinatorName: 'Sarah James',
          coordinatorRole: 'Patient Care Coordinator',
          lastUpdated: 'Today',
          createdAt: '24 Aug 2026',
          reviewText: null,
          reviewAccepted: false,
          reviewAcceptedAt: null,
          documentCount: 0
        });
      }
    } catch (err) {
      console.error('Unexpected error loading patient case review:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCaseDetails();
  }, [fetchCaseDetails]);

  const handleAcceptReview = async () => {
    if (!caseDetails || caseDetails.id === 'demo-123') return;
    setAccepting(true);
    try {
      const { error } = await supabase
        .from('cases')
        .update({
          review_accepted: true,
          review_accepted_at: new Date().toISOString(),
        })
        .eq('id', caseDetails.id);

      if (error) {
        console.error('Error accepting review:', error.message);
        return;
      }

      setCaseDetails({
        ...caseDetails,
        reviewAccepted: true,
        reviewAcceptedAt: new Date().toISOString(),
      });
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="w-6 h-6 text-blue-900 animate-spin mr-2" />
        <span className="text-sm font-medium text-slate-600">Loading your case details...</span>
      </div>
    );
  }

  const currentStageIndex = STAGES.indexOf(caseDetails?.stage || 'Case Review');
  const hasReview = !!caseDetails?.reviewText;
  const reviewAccepted = !!caseDetails?.reviewAccepted;

  return (
    <div className="p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full font-sans">
      
      {/* Patient Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-md">
              {reviewAccepted ? 'Review Accepted' : 'Under Review'}
            </span>
            <span className="text-xs text-slate-500">
              Last Updated {caseDetails?.lastUpdated}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 mt-2 leading-tight">
            Your Medical Case Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Reference ID: {caseDetails?.caseId}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/documents"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload New Documents
          </Link>
        </div>
      </div>

      {/* Reusable Healthcare Stepper */}
      <HealthcareStepper />

      {/* Case Overview Alert Box - only when no review yet */}
      {!hasReview && (
        <div className="p-5 sm:p-6 bg-amber-50/60 border border-amber-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <h3 className="text-base font-bold text-amber-900">Awaiting Care Team Review</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700">
              Our medical coordinators are evaluating your submitted records. You will receive a notification as soon as your recommendation plan is ready.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link 
              href="/dashboard/messages"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors w-full sm:w-auto text-center"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Contact Coordinator
            </Link>
          </div>
        </div>
      )}

      {/* Coordinator Note Display Block - now shows real review_text + accept flow */}
      {hasReview && (
        <div className="bg-white border-l-4 border-l-blue-900 p-5 sm:p-6 rounded-r-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              REVIEW FROM YOUR CARE COORDINATOR
            </span>
            {reviewAccepted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
            &quot;{caseDetails?.reviewText}&quot;
          </p>
          {!reviewAccepted && (
            <button
              onClick={handleAcceptReview}
              disabled={accepting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors"
            >
              {accepting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Accept Review
            </button>
          )}
        </div>
      )}

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Assigned Care Coordinator Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              YOUR CARE COORDINATOR
            </span>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-sm shrink-0">
                {caseDetails?.coordinatorName.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900">{caseDetails?.coordinatorName}</h4>
                <p className="text-xs text-slate-500">{caseDetails?.coordinatorRole}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Assigned on {caseDetails?.createdAt}
            </p>
          </div>
          <Link 
            href="/dashboard/messages"
            className="inline-block text-center px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto self-start"
          >
            Send Message
          </Link>
        </div>

        {/* Case Summary Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
            CASE DETAILS SUMMARY
          </span>
          <div className="space-y-2.5 text-xs text-slate-600 pt-1">
            <p><strong className="text-slate-900 font-semibold">Reference Number:</strong> {caseDetails?.caseId}</p>
            <p><strong className="text-slate-900 font-semibold">Healthcare Service:</strong> {caseDetails?.healthcareNeed}</p>
            <p><strong className="text-slate-900 font-semibold">Current Phase:</strong> {caseDetails?.workflowStage}</p>
            <p><strong className="text-slate-900 font-semibold">Case Initiated:</strong> {caseDetails?.createdAt}</p>
          </div>
        </div>

        {/* Patient Documents Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              SUBMITTED DOCUMENTS
            </span>
            <div className="space-y-1 text-xs text-slate-600 pt-1">
              <p className="font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-900" />
                {caseDetails?.documentCount} Medical Files Uploaded
              </p>
              <p className="text-slate-500 pl-6">
                All uploaded scans and files are secured and encrypted.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/documents"
            className="text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1 transition-colors pt-2"
          >
            View Your Uploaded Files <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick Links / Help Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              NEED HELP OR HAVE QUESTIONS?
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              If you have additional medical records, imaging, or questions about treatment options, feel free to upload them or reach out directly to your care coordinator.
            </p>
          </div>
          <Link
            href="/dashboard/messages"
            className="text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1 transition-colors pt-2"
          >
            Go to Message Center <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}