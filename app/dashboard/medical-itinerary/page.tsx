'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Send, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { createClient } from '../../utils/supabase/client';
import HealthcareStepper from '../_components/HealthcareStepper';

interface TravelPlan {
  id: string;
  itinerary_notes: string | null;
  itinerary_confirmed_by_patient: boolean;
}

export default function MedicalItineraryPage() {
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'journey' | 'itinerary'>('journey');
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [firstName, setFirstName] = useState('there');
  const [caseNumber, setCaseNumber] = useState('HW-2026-531971');
  const [need, setNeed] = useState('Guidance & Consultation');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();

      const resolvedName = profile?.full_name || user.email?.split('@')[0];
      if (resolvedName) setFirstName(resolvedName.split(' ')[0]);

      const { data: caseData } = await supabase
        .from('cases')
        .select('id, case_number, need, selected_hospital_id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (!caseData) {
        setLoading(false);
        return;
      }

      setCaseNumber(caseData.case_number || caseNumber);
      setNeed(caseData.need || need);
      setSelectedHospitalId(caseData.selected_hospital_id || null);

      const { data: travelData } = await supabase
        .from('travel_plans')
        .select('id, itinerary_notes, itinerary_confirmed_by_patient')
        .eq('case_id', caseData.id)
        .maybeSingle();

      setTravelPlan(travelData as TravelPlan | null);
    } catch (err) {
      console.error('Error loading medical itinerary:', err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleConfirmItinerary = async () => {
    if (!travelPlan) return;
    setConfirming(true);
    try {
      const { error } = await supabase
        .from('travel_plans')
        .update({ itinerary_confirmed_by_patient: true, updated_at: new Date().toISOString() })
        .eq('id', travelPlan.id);

      if (error) {
        console.error('Error confirming itinerary:', error.message);
        return;
      }
      setTravelPlan({ ...travelPlan, itinerary_confirmed_by_patient: true });
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="w-6 h-6 text-blue-900 animate-spin mr-2" />
        <span className="text-sm font-medium text-slate-600">Loading your itinerary...</span>
      </div>
    );
  }

  // Gating: this stage doesn't apply until a hospital has been selected —
  // mirrors the admin's per-stage unlock logic.
  const hospitalSelected = !!selectedHospitalId;
  const hasItinerary = !!travelPlan?.itinerary_notes;
  const itineraryConfirmed = !!travelPlan?.itinerary_confirmed_by_patient;

  return (
    <div className="p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full font-sans">
      
      {/* Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
            {activeTab === 'journey' ? `Good to see you, ${firstName}.` : 'Your Medical Itinerary'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {activeTab === 'journey' 
              ? `Case ${caseNumber} · Last updated Today` 
              : 'Scheduled appointments and care steps prepared by your coordinator.'
            }
          </p>
        </div>
        {activeTab === 'journey' && (
          <Link 
            href="/dashboard/consultation/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            New Consultation
          </Link>
        )}
      </div>

      {/* Promotional Banner */}
      {activeTab === 'journey' && (
        <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <Send className="w-4 h-4 text-emerald-600 rotate-45 shrink-0 mt-0.5 sm:mt-0" />
            <span className="text-xs sm:text-sm text-slate-800 font-medium leading-normal">
              <strong className="font-semibold text-slate-900">New:</strong> Flight Booking & Scheduling — save up to 5% on all flights.
            </span>
          </div>
          <Link
            href="/dashboard/flights"
            className="text-xs sm:text-sm font-bold text-blue-900 hover:text-blue-700 transition-colors whitespace-nowrap self-end sm:self-auto"
          >
            Learn more →
          </Link>
        </div>
      )}

      {/* Reusable Healthcare Stepper */}
      <HealthcareStepper />

      {/* Not-yet-reached state */}
      {!hospitalSelected && (
        <div className="p-5 sm:p-6 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex items-start gap-3">
          <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-slate-600">Medical Itinerary not yet available</h3>
            <p className="text-xs text-slate-500 mt-1">
              This becomes available once you&apos;ve selected a hospital from your recommendations.
            </p>
            <Link href="/dashboard/recommendations" className="text-xs font-semibold text-blue-900 hover:text-blue-700 inline-block mt-2">
              View Hospital Recommendations →
            </Link>
          </div>
        </div>
      )}

      {/* Action Banner / Medical Itinerary Details */}
      {hospitalSelected && activeTab === 'journey' && (
        <div className="p-5 sm:p-6 bg-emerald-50/60 border border-emerald-100/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-blue-900">
              {itineraryConfirmed ? 'Itinerary Confirmed' : hasItinerary ? 'Review Your Medical Itinerary' : 'Itinerary Not Yet Ready'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {hasItinerary
                ? 'Your care schedule and clinical appointments have been prepared by your coordinator.'
                : "Your coordinator hasn't published your itinerary yet. We'll notify you as soon as it's ready."}
            </p>
          </div>
          <button 
            onClick={() => hasItinerary && setActiveTab('itinerary')}
            disabled={!hasItinerary}
            className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors w-full sm:w-auto whitespace-nowrap cursor-pointer"
          >
            View Itinerary
          </button>
        </div>
      )}

      {hospitalSelected && activeTab === 'itinerary' && (
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
            <h3 className="text-base font-bold text-blue-900">Upcoming Medical Schedule</h3>
            <div className="flex items-center gap-2">
              {itineraryConfirmed && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                </span>
              )}
              <button
                onClick={() => setActiveTab('journey')}
                className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                ← Back to Overview
              </button>
            </div>
          </div>

          {travelPlan?.itinerary_notes && (
            <div className="border-l-2 border-emerald-600 pl-4 py-1">
              <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {travelPlan.itinerary_notes}
              </p>
            </div>
          )}

          {!itineraryConfirmed && (
            <button
              onClick={handleConfirmItinerary}
              disabled={confirming}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors"
            >
              {confirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Confirm Itinerary
            </button>
          )}
        </div>
      )}

      {/* Coordinator Note */}
      <div className="bg-white border-l-4 border-l-emerald-600 p-5 sm:p-6 rounded-r-2xl border border-slate-200 shadow-xs space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
          CASE REVIEW FROM YOUR COORDINATOR
        </span>
        <p className="text-xs sm:text-sm text-slate-800 break-words leading-relaxed font-medium">
          {hasItinerary
            ? 'Your itinerary has been prepared — review the details above and confirm when ready.'
            : 'Your initial medical documents have been successfully reviewed. We are preparing the primary consultation schedule with our clinical team.'}
        </p>
        <p className="text-[11px] text-slate-400 font-medium pt-1">
          Sarah James · Just now
        </p>
      </div>

      {/* 2x2 Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Assigned Care Coordinator Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 sm:space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              ASSIGNED CARE COORDINATOR
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-sm shrink-0">
                S
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900">Sarah James</h4>
                <p className="text-xs text-slate-500">Patient Care Coordinator</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">Available Monday–Friday, 9:00 AM–5:00 PM</p>
          </div>
          <Link 
            href="/dashboard/messages"
            className="inline-block text-center px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors w-full sm:w-auto self-start"
          >
            Send Message
          </Link>
        </div>

        {/* Case Summary Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 sm:space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
            CASE SUMMARY
          </span>
          <div className="space-y-2 text-xs text-slate-600">
            <p><strong className="text-slate-900 font-semibold">Case ID:</strong> {caseNumber}</p>
            <p><strong className="text-slate-900 font-semibold">Healthcare Need:</strong> {need}</p>
            <p><strong className="text-slate-900 font-semibold">Stage:</strong> Medical Itinerary</p>
            <p><strong className="text-slate-900 font-semibold">Started:</strong> Today</p>
          </div>
        </div>

        {/* Recent Messages Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              RECENT MESSAGES
            </span>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              &quot;Good question. Let me confirm the details with our clinical advisor and follow up within t...&quot;
            </p>
            <p className="text-[11px] text-slate-400">Sarah James · Just now</p>
          </div>
          <Link
            href="/dashboard/messages"
            className="text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1 transition-colors pt-2"
          >
            Open Messages <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Documents Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              DOCUMENTS
            </span>
            <div className="space-y-1 text-xs text-slate-600">
              <p>1 document on file</p>
              <p className="text-slate-400">0 under review</p>
            </div>
          </div>
          <Link
            href="/dashboard/documents"
            className="text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1 transition-colors pt-2"
          >
            View Documents <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Quick Actions Row */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
          QUICK ACTIONS
        </span>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
          <Link href="/dashboard/documents/upload" className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors text-center">
            Upload Document
          </Link>
          <Link href="/dashboard/recommendations" className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors text-center">
            View Recommendations
          </Link>
          <Link href="/dashboard/billing" className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors text-center">
            Billing & Payments
          </Link>
          <Link href="/dashboard/messages" className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors text-center">
            Message Coordinator
          </Link>
          <Link href="/dashboard/consultation/new" className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors text-center">
            Start a New Consultation
          </Link>
        </div>
      </div>

    </div>
  );
}