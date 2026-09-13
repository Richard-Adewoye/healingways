'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserX, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { loginUser, isAdminEmail } from '@/app/lib/firebase/services';

export default function PatientLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [identifier, setIdentifier] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      const emailParam = searchParams.get('email');
      return emailParam || sessionStorage.getItem('hw_login_draft_email') || localStorage.getItem('hw_user_email') || '';
    } catch {
      return '';
    }
  });

  const [password, setPassword] = useState<string>('');

  const [loading, setLoading] = useState(false);

  const [notFoundUser, setNotFoundUser] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return sessionStorage.getItem('hw_login_not_found_user') || null;
    } catch {
      return null;
    }
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return sessionStorage.getItem('hw_login_error_msg') || null;
    } catch {
      return null;
    }
  });

  // Handle email changes
  const handleEmailChange = (val: string) => {
    setIdentifier(val);
    if (notFoundUser) {
      setNotFoundUser(null);
      try { sessionStorage.removeItem('hw_login_not_found_user'); } catch {}
    }
    if (errorMessage) {
      setErrorMessage(null);
      try { sessionStorage.removeItem('hw_login_error_msg'); } catch {}
    }
    try {
      sessionStorage.setItem('hw_login_draft_email', val);
      if (val) localStorage.setItem('hw_user_email', val);
    } catch {}
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (errorMessage) {
      setErrorMessage(null);
      try { sessionStorage.removeItem('hw_login_error_msg'); } catch {}
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const cleanEmail = identifier.trim();
    if (!cleanEmail) {
      const msg = 'Please enter your email address.';
      setErrorMessage(msg);
      try { sessionStorage.setItem('hw_login_error_msg', msg); } catch {}
      return;
    }

    if (!password) {
      const msg = 'Please enter your password.';
      setErrorMessage(msg);
      try { sessionStorage.setItem('hw_login_error_msg', msg); } catch {}
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setNotFoundUser(null);
    try {
      sessionStorage.removeItem('hw_login_error_msg');
      sessionStorage.removeItem('hw_login_not_found_user');
    } catch {}

    try {
      const res = await loginUser(cleanEmail, password);

      if (res.success && res.user) {
        try {
          sessionStorage.removeItem('hw_login_not_found_user');
          sessionStorage.removeItem('hw_login_error_msg');
        } catch {}

        const destination = res.user.role === 'admin' || isAdminEmail(cleanEmail) ? '/admin' : '/dashboard';
        router.push(destination);
        router.refresh();
        return;
      }

      if (res.reason === 'not_found') {
        setNotFoundUser(cleanEmail);
        try {
          sessionStorage.setItem('hw_login_not_found_user', cleanEmail);
          sessionStorage.setItem('hw_signup_draft_email', cleanEmail);
        } catch {}
      } else if (res.reason === 'wrong_password') {
        const msg = 'Incorrect password. Please verify your credentials and try again.';
        setErrorMessage(msg);
        try { sessionStorage.setItem('hw_login_error_msg', msg); } catch {}
      } else {
        const msg = res.error || 'Failed to sign in. Please verify your credentials.';
        setErrorMessage(msg);
        try { sessionStorage.setItem('hw_login_error_msg', msg); } catch {}
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      const err = error as { message?: string };
      const msg = err?.message || 'An error occurred during sign in. Please try again.';
      setErrorMessage(msg);
      try { sessionStorage.setItem('hw_login_error_msg', msg); } catch {}
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 sm:p-8 md:p-10 space-y-6">
        {/* Header & Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="relative w-44 h-14 mb-2 block rounded-lg focus-visible:ring-2 focus-visible:ring-blue-600">
            <Image
              src="/healing-ways-logo.png"
              alt="HealingWays Logo"
              fill
              className="object-contain"
              priority
            />
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Sign in to access your consultations and care journey.
          </p>
        </div>

        {/* Account Not Found Prompt */}
        {notFoundUser && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl space-y-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 text-amber-800">
                <UserX className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-950">No account found</h4>
                <p className="text-xs text-amber-900 leading-relaxed">
                  We couldn&apos;t find an account for <strong className="font-bold text-slate-900">{notFoundUser}</strong>. Please sign up to create your account.
                </p>
              </div>
            </div>
            <div className="pt-1">
              <Link
                href={`/signup?email=${encodeURIComponent(notFoundUser)}`}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl text-center shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <span>Sign Up &amp; Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Generic Error Alert Box */}
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-900 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Email Address
            </label>
            <input
              type="email"
              required
              value={identifier}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="patient@healingways.com"
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-800">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>

          {/* Main Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition-all disabled:opacity-50 flex justify-center items-center cursor-pointer mt-2 focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-100 space-y-3 text-center">
          <p className="text-xs text-slate-600">
            Don&apos;t have an account?{' '}
            <Link
              href={identifier ? `/signup?email=${encodeURIComponent(identifier)}` : '/signup'}
              className="font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
            >
              Create an Account
            </Link>
          </p>
          <p className="text-xs text-slate-500">
            Need immediate clinical guidance?{' '}
            <Link
              href="/consultation"
              className="font-semibold text-blue-800 hover:text-blue-950 hover:underline"
            >
              Start Free Consultation Intake
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
