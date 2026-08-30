'use client';

import React, { useState } from 'react';
import Header from '../Header';
import { Plus, FileText, X } from 'lucide-react';

const categories = ['All', 'Medical Reports', 'Identification', 'Visa Documents', 'Other'];

export default function DocumentsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('Medical Reports');
  const [insight, setInsight] = useState('das');

  return (
    <div className="p-6 sm:p-10 max-w-7xl space-y-8">
      <Header title="Documents" />

      <div>
        <h2 className="text-2xl font-bold text-blue-900">Documents</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload and track medical and identification documents for your case.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
          UPLOAD A DOCUMENT
        </span>

        <div className="space-y-1.5 max-w-md">
          <label className="block text-xs font-bold text-blue-900">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option>Medical Reports</option>
            <option>Identification</option>
            <option>Visa Documents</option>
            <option>Other</option>
          </select>
        </div>
        <p className="text-[11px] text-slate-400">
          Choose the category before uploading — documents stay filed under whichever category you pick, no matter what the file is named.
        </p>

        {/* Drag & Drop Target */}
        <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-8 text-center space-y-2 cursor-pointer hover:bg-slate-100/50 transition-colors">
          <div className="w-8 h-8 rounded-full border border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
            <Plus className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            <strong className="text-emerald-700 font-bold">Click to upload</strong> or drag and drop
          </p>
          <p className="text-[11px] text-slate-400">
            PDF, JPG, PNG, HEIC, DOCX, MP4 or MOV — max 25MB each. You can select multiple files at once.
          </p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Uploaded File Item */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                2025_Day_1_Rewrite_v1_IntroductionToAgents.pdf
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Medical Reports · Today</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-100">
              Uploaded
            </span>
            <button className="text-red-400 hover:text-red-600 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3 space-y-1.5">
          <label className="block text-xs font-bold text-blue-900">Insights</label>
          <p className="text-[11px] text-slate-400">
            Add any context your coordinator should know about this document.
          </p>
          <textarea
            rows={2}
            value={insight}
            onChange={(e) => setInsight(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}