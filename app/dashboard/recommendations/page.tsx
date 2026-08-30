'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Send, 
  PlusSquare, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { createClient } from '../../utils/supabase/client';
import HealthcareStepper from '../_components/HealthcareStepper';

interface Hospital {
  id: string;
  name: string;
  location: string;
  specialties: string[] | null;
  description: string | null;
}

interface Recommendation {
  id: string;
  hospital: Hospital;
}

function unwrap<T>(val: T | T[] | null | undefined): T | null {
  if (!val) return null;
  return Array.isArray(val) ? val[0] ?? null : val;
}

export default function RecommendationsPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [caseNumber, setCaseNumber] = useState<string>('HW-2026-531971');
  const [need, setNeed] = useState<string>('Not sure, I need guidance');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

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

      setCaseId(caseData.id);
      setCaseNumber(caseData.case_number || caseNumber);
      setNeed(caseData.need || need);
      setSelectedHospitalId(caseData.selected_hospital_id || null);

      const { data: recsData } = await supabase
        .from('case_hospital_recommendations')
        .select('id, hospital:hospitals ( id, name, location, specialties, description )')
        .eq('case_id', caseData.id);

      const mapped: Recommendation[] = (recsData || []).map((r: any) => ({
        id: r.id,
        hospital: unwrap(r.hospital) as Hospital,
      }));
      setRecommendations(mapped);
    } catch (err) {
      console.error('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectHospital = async (hospitalId: string) => {
    if (!caseId) return;
    setSelecting(hospitalId);
    try {
      const { error } = await supabase
        .from('cases')
        .update({ selected_hospital_id: hospitalId })
        .eq('id', caseId);

      if (error) {
        console.error('Error selecting hospital:', error.message);
        return;
      }
      setSelectedHospitalId(hospitalId);
    } finally {
      setSelecting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="w-6 h-6 text-blue-900 animate-spin mr-2" />
        <span className="text-sm font-medium text-slate-600">Loading your recommendations...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full font-sans">
      
      {/* Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
            Hospital Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Case {caseNumber} · {recommendations.length} option{recommendations.length === 1 ? '' : 's'} from your coordinator
          </p>
        </div>
        <Link 
          href="/dashboard/consultation/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          New Consultation
        </Link>
      </div>

      {/* Promotional / Announcement Banner */}
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

      {/* Reusable Healthcare Stepper */}
      <HealthcareStepper />

      {/* Hospital Options or Empty State */}
      {recommendations.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100/60 text-emerald-600 flex items-center justify-center mx-auto">
            <PlusSquare className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-blue-900">
            Your recommendations are being prepared
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Our clinical advisors are still reviewing your case. We&apos;ll notify you as soon as they&apos;re ready.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {selectedHospitalId && (
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs sm:text-sm text-emerald-900 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              You&apos;ve selected a hospital. Your coordinator will follow up with next steps.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {recommendations.map((rec) => {
              const isSelected = rec.hospital.id === selectedHospitalId;
              return (
                <div
                  key={rec.id}
                  className={`bg-white p-5 sm:p-6 rounded-2xl border shadow-xs space-y-3 ${
                    isSelected ? 'border-emerald-400 ring-1 ring-emerald-200' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-blue-900">{rec.hospital.name}</h3>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {rec.hospital.location}
                  </p>
                  {rec.hospital.specialties && rec.hospital.specialties.length > 0 && (
                    <p className="text-xs text-slate-600">{rec.hospital.specialties.join(', ')}</p>
                  )}
                  {rec.hospital.description && (
                    <p className="text-xs text-slate-500 leading-relaxed">{rec.hospital.description}</p>
                  )}
                  <button
                    onClick={() => handleSelectHospital(rec.hospital.id)}
                    disabled={isSelected || selecting === rec.hospital.id || !!selectedHospitalId}
                    className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 font-semibold text-xs rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-emerald-100 text-emerald-700 cursor-default'
                        : 'bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white'
                    }`}
                  >
                    {selecting === rec.hospital.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isSelected ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : null}
                    {isSelected ? 'Selected' : 'Select This Hospital'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
            <p><strong className="text-slate-900 font-semibold">Stage:</strong> Hospital Recommendation</p>
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
          <Link href="/dashboard/documents" className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors text-center">
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