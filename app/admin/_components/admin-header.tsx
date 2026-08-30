'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Menu } from 'lucide-react';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4 bg-white border-b border-slate-200 shrink-0 sticky top-0 z-30 min-w-0">
      
      {/* Left Section: Menu Toggle + Title */}
      <div className="flex items-center gap-3 min-w-0 pr-2">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            aria-label="Open sidebar"
            className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-base sm:text-xl font-bold text-blue-900 truncate">
          Dashboard
        </h1>
      </div>

      {/* Right Section: Navigation & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-5 shrink-0">
        <Link
          href="/"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap"
        >
          <span className="hidden sm:inline">← Back to Website</span>
          <span className="sm:hidden">← Exit</span>
        </Link>

        <button className="p-2 text-slate-500 hover:text-slate-700 relative rounded-full hover:bg-slate-100 transition-colors shrink-0">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2.5 sm:gap-3 pl-2 border-l border-slate-200 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm shrink-0">
            S
          </div>
          <div className="hidden md:block text-left leading-tight">
            <p className="text-xs sm:text-sm font-bold text-slate-800">Sarah James</p>
            <p className="text-[11px] text-slate-500 font-medium">Care Coordinator</p>
          </div>
        </div>
      </div>
    </header>
  );
}