'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../Header';
import { Bed, Loader2, CheckCircle2, Lock, FileCheck } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';
import HealthcareStepper from '../_components/HealthcareStepper';

interface TravelPlan {
  id: string;
  accommodation_details: string | null;
  visa_details: string | null;
  accommodation_visa_confirmed_by_patient: boolean;
  itinerary_confirmed_by_patient: boolean;
}

export default function AccommodationPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);

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
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (!caseData) {
        setLoading(false);
        return;
      }

      const { data: travelData } = await supabase
        .from('travel_plans')
        .select('id, accommodation_details, visa_details, accommodation_visa_confirmed_by_patient, itinerary_confirmed_by_patient')
        .eq('case_id', caseData.id)
        .maybeSingle();

      setTravelPlan(travelData as TravelPlan | null);
    } catch (err) {
      console.error('Error loading accommodation & visa details:', err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleConfirm = async () => {
    if (!travelPlan) return;
    setConfirming(true);
    try {
      const { error } = await supabase
        .from('travel_plans')
        .update({ accommodation_visa_confirmed_by_patient: true, updated_at: new Date().toISOString() })
        .eq('id', travelPlan.id);

      if (error) {
        console.error('Error confirming accommodation & visa:', error.message);
        return;
      }
      setTravelPlan({ ...travelPlan, accommodation_visa_confirmed_by_patient: true });
    } finally {
      setConfirming(false);
    }
  };

  // Gating: this stage doesn't apply until the patient has confirmed the
  // Medical Itinerary stage before it.
  const itineraryConfirmed = !!travelPlan?.itinerary_confirmed_by_patient;
  const hasDetails = !!(travelPlan && (travelPlan.accommodation_details || travelPlan.visa_details));
  const confirmed = !!travelPlan?.accommodation_visa_confirmed_by_patient;

  return (
    <div className="p-4 sm:p-8 md:p-10 max-w-7xl mx-auto w-full font-sans space-y-6">
      <Header title="Accommodation & Visa" />
      
      {/* Reusable Healthcare Stepper */}
      <HealthcareStepper />

      {loading ? (
        <div className="flex items-center justify-center p-12 min-h-[200px]">
          <Loader2 className="w-6 h-6 text-blue-900 animate-spin mr-2" />
          <span className="text-sm font-medium text-slate-600">Loading your accommodation & visa details...</span>
        </div>
      ) : !itineraryConfirmed ? (
        <div className="max-w-xl mx-auto my-12 bg-slate-50/80 border border-dashed border-slate-300 rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-200/60 text-slate-500 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-600 max-w-xs mx-auto leading-snug">
            Not yet available
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Accommodation and visa details become available once you&apos;ve confirmed your Medical Itinerary.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/medical-itinerary"
              className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors"
            >
              View Medical Itinerary
            </Link>
          </div>
        </div>
      ) : hasDetails ? (
        <div className="max-w-xl mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-8 space-y-5 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100/60 text-emerald-600 flex items-center justify-center mx-auto">
            <Bed className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-blue-900 text-center">
            Accommodation & Visa Details
          </h3>

          {travelPlan?.accommodation_details && (
            <div className="text-left space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wide text-blue-900 flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5" /> Accommodation
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {travelPlan.accommodation_details}
              </p>
            </div>
          )}

          {travelPlan?.visa_details && (
            <div className="text-left space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wide text-blue-900 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5" /> Visa
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {travelPlan.visa_details}
              </p>
            </div>
          )}

          {confirmed ? (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full mx-auto w-fit">
              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
            </div>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors"
            >
              {confirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Confirm Accommodation & Visa
            </button>
          )}
        </div>
      ) : (
        <div className="max-w-xl mx-auto my-12 bg-slate-50/80 border border-slate-100 rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100/60 text-emerald-600 flex items-center justify-center mx-auto">
            <Bed className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-blue-900 max-w-xs mx-auto leading-snug">
            Being prepared by your coordinator
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Your coordinator is finalizing your accommodation and visa details. We&apos;ll notify you as soon as they&apos;re ready.
          </p>
        </div>
      )}
    </div>
  );
}