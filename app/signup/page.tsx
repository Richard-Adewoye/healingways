'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { registerUser, getUserActiveCase } from '@/app/lib/firebase/services';

function RegisterForm() {
  const router = useRouter();

  // Consultation must be completed before account creation
  const [hasCompletedConsultation, setHasCompletedConsultation] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const sp = new URLSearchParams(window.location.search);
      const fromParam = sp.get('from') === 'consultation' || sp.get('consultation') === 'done';
      const caseIdParam = sp.get('caseId');
      const consultationSubmitted = localStorage.getItem('hw_consultation_completed') === 'true';
      const storedCase = localStorage.getItem('hw_active_case_id') || localStorage.getItem('hw_consultation_case_id');
      const hasStoredCase = !!storedCase && (storedCase.startsWith('case_') || storedCase.startsWith('HW-'));

      return fromParam || !!caseIdParam || (consultationSubmitted && hasStoredCase);
    } catch {
      return false;
    }
  });

  const [caseReference, setCaseReference] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      const sp = new URLSearchParams(window.location.search);
      return sp.get('caseId') || localStorage.getItem('hw_active_case_id') || localStorage.getItem('hw_consultation_case_id') || '';
    } catch {
      return '';
    }
  });

  const [fullName, setFullName] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      const sp = new URLSearchParams(window.location.search);
      return (
        sp.get('name') ||
        sessionStorage.getItem('hw_signup_draft_fullname') ||
        localStorage.getItem('hw_user_fullname') ||
        ''
      );
    } catch {
      return '';
    }
  });

  const [email, setEmail] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      const sp = new URLSearchParams(window.location.search);
      return (
        sp.get('email') ||
        sessionStorage.getItem('hw_signup_draft_email') ||
        sessionStorage.getItem('hw_login_not_found_user') ||
        localStorage.getItem('hw_user_email') ||
        ''
      );
    } catch {
      return '';
    }
  });

  const [password, setPassword] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      return (
        sessionStorage.getItem('hw_signup_draft_password') ||
        sessionStorage.getItem('hw_login_draft_password') ||
        ''
      );
    } catch {
      return '';
    }
  });

  const [confirmPassword, setConfirmPassword] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      return (
        sessionStorage.getItem('hw_signup_draft_confirm_password') ||
        sessionStorage.getItem('hw_signup_draft_password') ||
        sessionStorage.getItem('hw_login_draft_password') ||
        ''
      );
    } catch {
      return '';
    }
  });

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return sessionStorage.getItem('hw_signup_error_msg') || null;
    } catch {
      return null;
    }
  });

  // Persist draft changes into sessionStorage
  const handleFullNameChange = (val: string) => {
    setFullName(val);
    try { sessionStorage.setItem('hw_signup_draft_fullname', val); } catch {}
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (errorMessage) {
      setErrorMessage(null);
      try { sessionStorage.removeItem('hw_signup_error_msg'); } catch {}
    }
    try {
      sessionStorage.setItem('hw_signup_draft_email', val);
      if (val) localStorage.setItem('hw_user_email', val);
    } catch {}
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (errorMessage) {
      setErrorMessage(null);
      try { sessionStorage.removeItem('hw_signup_error_msg'); } catch {}
    }
    try { sessionStorage.setItem('hw_signup_draft_password', val); } catch {}
  };

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (errorMessage) {
      setErrorMessage(null);
      try { sessionStorage.removeItem('hw_signup_error_msg'); } catch {}
    }
    try { sessionStorage.setItem('hw_signup_draft_confirm_password', val); } catch {}
  };

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      const msg = 'Please provide an email address.';
      setErrorMessage(msg);
      try { sessionStorage.setItem('hw_signup_error_msg', msg); } catch {}
      return;
    }

    if (!password) {
      const msg = 'Please enter a password.';
      setErrorMessage(msg);
      try { sessionStorage.setItem('hw_signup_error_msg', msg); } catch {}
      return;
    }

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match.';
      setErrorMessage(msg);
      try { sessionStorage.setItem('hw_signup_error_msg', msg); } catch {}
      return;
    }

    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      setErrorMessage(msg);
      try { sessionStorage.setItem('hw_signup_error_msg', msg); } catch {}
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try { sessionStorage.removeItem('hw_signup_error_msg'); } catch {}

    try {
      const res = await registerUser({
        fullName: fullName.trim() || 'Patient',
        email: cleanEmail,
        password,
      });

      if (res.success && res.user) {
        // Link any unassigned consultation case to this new user account
        try {
          await getUserActiveCase(res.user.uid, res.user.email);
        } catch (linkErr) {
          console.warn('Failed to link active case:', linkErr);
        }

        // Clear draft session storage upon successful registration
        try {
          sessionStorage.removeItem('hw_signup_draft_fullname');
          sessionStorage.removeItem('hw_signup_draft_email');
          sessionStorage.removeItem('hw_signup_draft_password');
          sessionStorage.removeItem('hw_signup_draft_confirm_password');
          sessionStorage.removeItem('hw_login_not_found_user');
          sessionStorage.removeItem('hw_signup_error_msg');
        } catch {}

        const destination = res.user.role === 'admin' || cleanEmail.toLowerCase().includes('admin') ? '/admin' : '/dashboard';
        router.push(destination);
        router.refresh();
        return;
      }

      if (res.reason === 'email_already_in_use') {
        const msg = 'An account with this email address already exists. Please sign in instead.';
        setErrorMessage(msg);
        try { sessionStorage.setItem('hw_signup_error_msg', msg); } catch {}
      } else {
        const msg = res.error || 'Failed to create your account. Please try again.';
        setErrorMessage(msg);
        try { sessionStorage.setItem('hw_signup_error_msg', msg); } catch {}
      }
    } catch (err: unknown) {
      console.error('Registration error:', err);
      const typedErr = err as { message?: string };
      const msg = typedErr?.message || 'Failed to create account. Please try again.';
      setErrorMessage(msg);
      try { sessionStorage.setItem('hw_signup_error_msg', msg); } catch {}
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 my-8 sm:my-0">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10 space-y-6">
        {/* Header & Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="relative w-44 h-16 mb-1 block">
            <Image
              src="/healing-ways-logo.png"
              alt="HealingWays Logo"
              fill
              className="object-contain"
              priority
            />
          </Link>
          <h1 className="text-xl font-bold text-blue-950">Create Your Account</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Join HealingWays to track your clinical itinerary and consultations.
          </p>
        </div>

        {/* Check if new user needs to fill consultation first */}
        {!hasCompletedConsultation ? (
          <div className="space-y-5">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-2.5 leading-relaxed">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                Step 1: Consultation Intake Required
              </div>
              <p>
                To provide tailored clinical evaluations, match accredited partner hospitals, and assign your dedicated case coordinator, all new patients must first complete the <strong>Consultation Intake</strong> form.
              </p>
              <p className="text-emerald-800">
                Completing the consultation will immediately unlock account creation so you can track your case file and clinical itinerary.
              </p>
            </div>

            <Link
              href={email ? `/consultation?email=${encodeURIComponent(email)}` : '/consultation'}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Consultation Intake</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Informative Banner when consultation is completed */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900 leading-relaxed animate-fadeIn">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-emerald-950">
                  Step 2: Finalize Your Account {caseReference ? `• Case ${caseReference}` : ''}
                </span>
                Consultation intake received! Enter a password below to finalize your account and access your patient journey dashboard.
              </div>
            </div>

            {/* Error Alert Box */}
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-blue-900">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => handleFullNameChange(e.target.value)}
                  placeholder="Jane Doe"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-blue-900">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-blue-900">
                  Password (min. 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-blue-900">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors disabled:opacity-50 flex justify-center items-center mt-2 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Creating account...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>
          </>
        )}

        <div className="border-t border-gray-100 pt-2" />

        {/* Login Back Link */}
        <div className="text-center text-xs text-gray-600 pt-1">
          Already have an account?{' '}
          <Link
            href={email ? `/login?email=${encodeURIComponent(email)}` : '/login'}
            className="font-bold text-blue-900 hover:underline transition-all"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PatientRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
