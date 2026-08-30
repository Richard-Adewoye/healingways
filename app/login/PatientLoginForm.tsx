'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabase/client';

export default function PatientLoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Helper function to verify if the authenticated user has completed
   * a consultation form before sending them to the dashboard.
   */
  const routeUserAfterAuth = async (userId: string) => {
    try {
      const { data: userCase, error } = await supabase
        .from('cases')
        .select('id, stage, user_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        // Detailed log to trace RLS / Database column issues
        console.error('Supabase Case Query Error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        
        // If an RLS or database error occurs, redirect to consultation intake
        router.push('/consultation');
        return;
      }

      // If no case exists for this user, send them to fill the form
      if (!userCase) {
        router.push('/consultation');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      console.error('Error verifying consultation status:', err?.message || err);
      router.push('/consultation');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const cleanIdentifier = identifier.trim();
    const isPhone = /^[+\d\s-]+$/.test(cleanIdentifier) && !cleanIdentifier.includes('@');

    const { data, error } = await supabase.auth.signInWithPassword(
      isPhone
        ? { phone: cleanIdentifier, password }
        : { email: cleanIdentifier, password }
    );

    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        setErrorMessage('Email not confirmed yet. Please check your inbox or contact support.');
      } else {
        setErrorMessage(error.message);
      }
      setLoading(false);
      return;
    }

    if (data.user) {
      await routeUserAfterAuth(data.user.id);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'demo@healingways.com',
      password: 'DemoPassword123!',
    });

    if (error) {
      router.push('/dashboard');
      return;
    }

    if (data.user) {
      await routeUserAfterAuth(data.user.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10 space-y-6">
        
        {/* Header & Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="relative w-40 h-20 mb-1">
            <Image
              src="/images/logo.png"
              alt="HealingWays Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Welcome back to your healthcare journey.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium text-center">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email or Phone Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-blue-900">
              Email or Phone
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or +1234567890"
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-blue-900">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>

          {/* Main Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? 'Verifying account...' : 'Login'}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-xs sm:text-sm font-bold text-blue-900 hover:underline transition-all"
          >
            Forgot password?
          </Link>
        </div>

        <div className="border-t border-gray-100 pt-2" />

        {/* Demo Patient Button */}
        <div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 bg-white hover:bg-emerald-50 border border-emerald-600 text-emerald-700 font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            Continue as Demo Patient
          </button>
        </div>

        {/* Sign Up Link: Redirects to consultation form */}
        <div className="text-center text-xs text-gray-500 pt-2">
          New to HealingWays?{' '}
          <Link
            href="/consultation"
            className="font-bold text-blue-900 hover:underline transition-all"
          >
            Start Consultation Form
          </Link>
        </div>

      </div>
    </div>
  );
}