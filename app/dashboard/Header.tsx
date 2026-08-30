'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  onOpenSidebar?: () => void;
}

export default function Header({ title, onOpenSidebar }: HeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200/80 pb-4 mb-6">
      {/* Title & Mobile Menu Button */}
      <div className="flex items-center gap-3">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors md:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg sm:text-xl font-bold text-blue-900">{title}</h1>
      </div>

      {/* User Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← <span className="hidden xs:inline">Back to </span>Website
        </Link>
        <button className="p-2 text-gray-500 hover:text-gray-700 relative rounded-full hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-sm shrink-0">
          A
        </div>
      </div>
    </div>
  );
}