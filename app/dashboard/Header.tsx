'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Menu, LogOut, ArrowLeft } from 'lucide-react';
import { logoutUser, getStoredUser } from '@/app/lib/firebase/services';

interface HeaderProps {
  title: string;
  onOpenSidebar?: () => void;
}

export default function Header({ title, onOpenSidebar }: HeaderProps) {
  const user = getStoredUser();
  const initial = user?.fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'P';

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    window.location.href = '/login';
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200/90 pb-4 mb-6">
      {/* Title & Mobile Menu Button */}
      <div className="flex items-center gap-3">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="p-2 text-slate-700 hover:text-slate-900 active:bg-slate-200 rounded-lg hover:bg-slate-100 transition-colors md:hidden focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
      </div>

      {/* User Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/"
          className="text-xs sm:text-sm font-semibold text-blue-700 hover:text-blue-900 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden rounded-md px-2 py-1 transition-colors hidden sm:inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
        </Link>
        <button 
          title="Notifications"
          aria-label="Notifications"
          className="p-2 text-slate-600 hover:text-slate-900 active:bg-slate-200 relative rounded-full hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <Link
            href="/dashboard/profile"
            title="View Profile"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-xs shrink-0 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            {initial}
          </Link>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-slate-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
