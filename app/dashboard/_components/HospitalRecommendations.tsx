'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Send, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  ArrowRight,
  Home,
  FileText,
  Calendar,
  MessageSquare,
  Briefcase,
  ShieldCheck,
  CreditCard,
  Folder,
  User,
  Building2
} from 'lucide-react';

export default function HealthcareJourneyPage() {
  const [activeTab, setActiveTab] = useState<'journey' | 'recommendations'>('journey');

  const steps = [
    { number: 1, title: "Consultation Submitted", completed: true },
    { number: 2, title: "Case Review", completed: true },
    { number: 3, title: "Hospital Recommendation", active: true },
    { number: 4, title: "Medical Itinerary" },
    { number: 5, title: "Accommodation & Visa" },
    { number: 6, title: "Travel Preparation" },
    { number: 7, title: "Treatment & Recovery" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex min-h-screen sticky top-0">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-gray-100 flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full border-2 border-[#1a237e] flex items-center justify-center text-[#1a237e] font-bold text-lg">
              Alo
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 py-6 space-y-1">
            <button
              onClick={() => setActiveTab('journey')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'journey' 
                  ? 'bg-blue-50 text-[#1a237e] border-l-4 border-[#1a237e]' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>My Healthcare Journey</span>
            </button>

            <button
              onClick={() => setActiveTab('recommendations')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'recommendations' 
                  ? 'bg-blue-50 text-[#1a237e] border-l-4 border-[#1a237e]' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Recommendations</span>
            </button>

            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              <span>Treatment Plan</span>
            </a>

            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
              <Briefcase className="w-4 h-4" />
              <span>Accommodation</span>
            </a>

            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
            </a>

            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
              <Folder className="w-4 h-4" />
              <span>My Cases</span>
            </a>

            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
              <ShieldCheck className="w-4 h-4" />
              <span>Visa Support</span>
            </a>

            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
              <CreditCard className="w-4 h-4" />
              <span>Billing & Payments</span>
            </a>

            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
              <FileText className="w-4 h-4" />
              <span>Documents</span>
            </a>

            <a href="#" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </a>
          </nav>
        </div>

        {/* Sidebar Footer Log Out */}
        <div className="p-4 border-t border-gray-200">
          <button className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center space-x-2">
            <LogOut className="w-4 h-4 text-gray-500" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#1e293b]">
              {activeTab === 'journey' ? 'My Healthcare Journey' : 'Hospital Recommendations'}
            </h1>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm font-medium text-[#2563eb] hover:underline flex items-center">
                &larr; Back to Website
              </a>
              
              <div className="relative cursor-pointer">
                <Bell className="w-5 h-5 text-gray-600 hover:text-gray-900" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </div>

              <div className="w-9 h-9 bg-[#2e7d32] text-white rounded-full flex items-center justify-center font-bold text-sm">
                A
              </div>
            </div>
          </header>

          {/* Main Body Content */}
          <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
            
            {/* 1. Header Greeting Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-[#1a237e] tracking-tight">
                  {activeTab === 'journey' ? 'Good to see you, Amara.' : 'Hospital Recommendations'}
                </h1>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  {activeTab === 'journey' 
                    ? 'Case HW-2026-531971 · Last updated Today' 
                    : 'Prepared by Sarah James based on your case. Review each option and let us know your decision.'
                  }
                </p>
              </div>
              
              {activeTab === 'journey' && (
                <button className="bg-[#2e7d32] hover:bg-[#256628] text-white font-medium px-4 py-2.5 rounded-lg flex items-center space-x-2 text-sm transition-colors shadow-sm self-start md:self-auto">
                  <div className="border border-white rounded-full p-0.5">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span>New Consultation</span>
                </button>
              )}
            </div>

            {/* 2. Banner */}
            {activeTab === 'journey' && (
              <div className="bg-[#e8f5e9] border border-[#c8e6c9] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Send className="w-5 h-5 text-[#2e7d32] transform -rotate-12" />
                  <p className="text-sm text-[#1b5e20] font-medium">
                    <span className="font-semibold">New: Flight Booking & Scheduling</span> &mdash; save up to 5% on all flights.
                  </p>
                </div>
                <a href="#" className="text-sm font-semibold text-[#1a237e] hover:underline flex items-center">
                  Learn more &rarr;
                </a>
              </div>
            )}

            {/* 3. Stepper Card */}
            {activeTab === 'journey' && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-xs font-bold tracking-wider text-[#2563eb] uppercase mb-6">
                  Your Healthcare Journey
                </h2>

                <div className="relative flex items-center justify-between px-4">
                  <div className="absolute top-4 left-10 right-10 h-0.5 bg-gray-200 -z-0" />
                  <div className="absolute top-4 left-10 w-[33%] h-0.5 bg-[#2e7d32] -z-0" />

                  {steps.map((step) => (
                    <div key={step.number} className="relative z-10 flex flex-col items-center text-center max-w-[100px]">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                          step.completed
                            ? 'bg-[#2e7d32] border-[#2e7d32] text-white'
                            : step.active
                            ? 'bg-white border-[#2e7d32] text-[#2e7d32]'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}
                      >
                        {step.completed ? <Check className="w-5 h-5 stroke-[3]" /> : step.number}
                      </div>
                      <span
                        className={`text-xs mt-3 font-medium leading-tight ${
                          step.active || step.completed ? 'text-[#2e7d32] font-semibold' : 'text-gray-600'
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center space-x-2 text-gray-400">
                  <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                  <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-gray-500 h-full w-[80%] rounded-full"></div>
                  </div>
                  <ChevronRight className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                </div>
              </div>
            )}

            {/* 4. Action Banner */}
            {activeTab === 'journey' ? (
              <div className="bg-[#e8f5e9] border border-[#c8e6c9] rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1e293b]">Review Your Hospital Recommendations</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Our advisors have prepared healthcare options based on your case &mdash; take a look and let us know your decision.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('recommendations')}
                  className="bg-[#2e7d32] hover:bg-[#256628] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap shadow-sm"
                >
                  View Recommendations
                </button>
              </div>
            ) : (
              /* Hospital Recommendation Detail Card (Image 4) */
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-[#1e293b]">
                    Al Noor Specialist Medical Center
                  </h3>
                  <span className="bg-[#fff7ed] text-[#c2410c] text-xs font-semibold px-3 py-1 rounded-full border border-[#ffedd5] self-start sm:self-auto">
                    Awaiting Your Decision
                  </span>
                </div>

                <p className="text-xs text-gray-500 font-medium">
                  Dubai, United Arab Emirates &middot; dermatology
                </p>

                <p className="text-xs text-gray-700 break-all font-mono">
                  esfdg bnm,&apos;:lkjsaAWSERDFTGYJKL;,MNBGF
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button className="bg-[#2e7d32] hover:bg-[#256628] text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors shadow-sm">
                    Accept This Recommendation
                  </button>
                  <button className="border border-[#2e7d32] text-[#2e7d32] hover:bg-[#e8f5e9] font-medium px-4 py-2 rounded-lg text-xs transition-colors">
                    Not This One
                  </button>
                </div>
              </div>
            )}

            {/* 5. Coordinator Case Review Note */}
            <div className="bg-white border-l-4 border-l-[#2e7d32] border-y border-r border-gray-200 rounded-r-xl p-6 shadow-sm">
              <h4 className="text-xs font-bold tracking-wider text-[#2563eb] uppercase mb-2">
                Case Review From Your Coordinator
              </h4>
              <p className="text-sm font-medium text-gray-800 break-all">
                edfgjkl;kjgfdrewqertyujk
              </p>
              <p className="text-xs text-gray-400 mt-3 font-medium">
                Sarah James &middot; Just now
              </p>
            </div>

            {/* 6. Information Grid (Care Coordinator, Case Summary, Recent Messages, Documents) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Assigned Care Coordinator */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-[#2563eb] uppercase mb-4">
                    Assigned Care Coordinator
                  </h4>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-[#1a237e] text-white rounded-full flex items-center justify-center font-bold text-sm">
                      S
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-gray-900">Sarah James</h5>
                      <p className="text-xs text-gray-500">Patient Care Coordinator</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-6">
                    Available Monday&ndash;Friday, 9:00 AM&ndash;5:00 PM
                  </p>
                </div>
                <div>
                  <button className="border border-[#2e7d32] text-[#2e7d32] hover:bg-[#e8f5e9] font-medium px-4 py-1.5 rounded-lg text-xs transition-colors">
                    Send Message
                  </button>
                </div>
              </div>

              {/* Case Summary */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-xs font-bold tracking-wider text-[#2563eb] uppercase mb-4">
                  Case Summary
                </h4>
                <div className="space-y-2 text-xs">
                  <p><span className="font-semibold text-gray-700">Case ID:</span> <span className="text-gray-600">HW-2026-531971</span></p>
                  <p><span className="font-semibold text-gray-700">Healthcare Need:</span> <span className="text-gray-600">Not sure, I need guidance</span></p>
                  <p><span className="font-semibold text-gray-700">Stage:</span> <span className="text-gray-600">Hospital Recommendation</span></p>
                  <p><span className="font-semibold text-gray-700">Started:</span> <span className="text-gray-600">Today</span></p>
                </div>
              </div>

              {/* Recent Messages */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-[#2563eb] uppercase mb-4">
                    Recent Messages
                  </h4>
                  <p className="text-xs text-gray-700 italic mb-3">
                    &quot;Good question. Let me confirm the details with our clinical advisor and follow up within t...&quot;
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    Sarah James &middot; Just now
                  </p>
                </div>
                <a href="#" className="text-xs font-bold text-[#1a237e] hover:underline flex items-center space-x-1">
                  <span>Open Messages</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>

              {/* Documents */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-[#2563eb] uppercase mb-4">
                    Documents
                  </h4>
                  <p className="text-xs font-medium text-gray-800">1 document on file</p>
                  <p className="text-xs text-gray-500 mt-2 mb-4">0 under review</p>
                </div>
                <a href="#" className="text-xs font-bold text-[#1a237e] hover:underline flex items-center space-x-1">
                  <span>View Documents</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>

            {/* 7. Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-xs font-bold tracking-wider text-[#2563eb] uppercase mb-4">
                Quick Actions
              </h4>
              <div className="flex flex-wrap gap-3">
                <button className="border border-[#2e7d32] text-[#2e7d32] hover:bg-[#e8f5e9] font-medium px-4 py-2 rounded-lg text-xs transition-colors">
                  Upload Document
                </button>
                <button 
                  onClick={() => setActiveTab('recommendations')}
                  className="border border-[#2e7d32] text-[#2e7d32] hover:bg-[#e8f5e9] font-medium px-4 py-2 rounded-lg text-xs transition-colors"
                >
                  View Recommendations
                </button>
                <button className="border border-[#2e7d32] text-[#2e7d32] hover:bg-[#e8f5e9] font-medium px-4 py-2 rounded-lg text-xs transition-colors">
                  Billing & Payments
                </button>
                <button className="border border-[#2e7d32] text-[#2e7d32] hover:bg-[#e8f5e9] font-medium px-4 py-2 rounded-lg text-xs transition-colors">
                  Message Coordinator
                </button>
                <button className="border border-[#2e7d32] text-[#2e7d32] hover:bg-[#e8f5e9] font-medium px-4 py-2 rounded-lg text-xs transition-colors">
                  Start a New Consultation
                </button>
              </div>
            </div>

          </main>
        </div>

        {/* Footer Log Out for Mobile View */}
        <footer className="border-t border-gray-200 bg-white px-6 py-3 mt-12 md:hidden">
          <button className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center space-x-2">
            <LogOut className="w-4 h-4 text-gray-500" />
            <span>Log Out</span>
          </button>
        </footer>
      </div>
    </div>
  );
}