'use client';

import React, { useEffect, useState } from 'react';
import { Check, Loader2, LogIn } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface StepSevenSuccessProps {
  userName?: string;
  caseId?: string;
  onGoToLogin?: () => void;
  onGoHome?: () => void;
}

export default function StepSevenSuccess({
  userName: initialUserName,
  caseId: initialCaseId,
  onGoToLogin,
  onGoHome,
}: StepSevenSuccessProps) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [userName, setUserName] = useState<string>(initialUserName || 'Patient');
  const [caseReference, setCaseReference] = useState<string>(initialCaseId || '');
  const [loading, setLoading] = useState<boolean>(!initialUserName || !initialCaseId);

  useEffect(() => {
    async function fetchLatestSubmission() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const metaName = user.user_metadata?.full_name || user.user_metadata?.name;
          if (metaName && !initialUserName) {
            setUserName(metaName.split(' ')[0]);
          }

          if (!initialCaseId) {
            const { data: latestCase } = await supabase
              .from('cases')
              .select('id, case_number')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (latestCase) {
              setCaseReference(latestCase.case_number || latestCase.id);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching context:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestSubmission();
  }, [supabase, initialUserName, initialCaseId]);

  const handleLogin = () => {
    if (typeof onGoToLogin === 'function') {
      onGoToLogin();
    }
    // Hard fallback redirect to ensure navigation occurs
    window.location.assign('/login');
  };

  const handleHome = () => {
    if (typeof onGoHome === 'function') {
      onGoHome();
    }
    window.location.assign('/');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-50 pointer-events-auto">
      <div className="max-w-xl w-full text-center space-y-6">

        {/* Success Icon Circle */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight leading-tight">
            Consultation Submitted, <br className="hidden sm:inline" />
            {userName}.
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            {loading ? (
              <span className="inline-flex items-center gap-2 text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" /> Fetching case details...
              </span>
            ) : (
              <>
                Your request has been filed under Case{' '}
                <span className="font-semibold text-slate-700">
                  {caseReference || 'HW-2026-655662'}
                </span>
                . Please log in to your account to view status updates and manage your healthcare portal.
              </>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 relative z-50">
          <button
            type="button"
            onClick={handleLogin}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer relative z-50 pointer-events-auto"
          >
            <LogIn className="w-4 h-4" />
            Proceed to Login
          </button>
          <button
            type="button"
            onClick={handleHome}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg transition-colors cursor-pointer relative z-50 pointer-events-auto"
          >
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}