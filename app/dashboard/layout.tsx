'use client';

import React, { useState } from 'react';
import Sidebar from './_components/Sidebar';
import { Menu, Check, FileText, Stethoscope, ClipboardList, HeartPulse } from 'lucide-react';

interface JourneyStage {
  id: number;
  label: string;
  description: string;
  icon: React.ElementType;
}

const JOURNEY_STAGES: JourneyStage[] = [
  { id: 1, label: 'Inquiry', description: 'Request submitted', icon: FileText },
  { id: 2, label: 'Consultation', description: 'Clinical review', icon: Stethoscope },
  { id: 3, label: 'Treatment Plan', description: 'Schedule & cost', icon: ClipboardList },
  { id: 4, label: 'Post-Care', description: 'Recovery follow-up', icon: HeartPulse },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Centralized current stage state (or pass this via React Context / global state)
  const [currentStage, setCurrentStage] = useState<number>(2);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile-Only Header Bar (Hidden on Desktop) */}
      <div className="md:hidden bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-bold text-blue-900 text-sm">HealingWays</span>
      </div>

      {/* Sidebar Component */}
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        onClose={() => setIsMobileOpen(false)} 
      />

      {/* Main Page Area */}
      <main className="flex-1 min-w-0 flex flex-col overflow-x-hidden">
        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}