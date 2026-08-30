'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Calendar, Loader2, ArrowRight } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';

interface PatientCase {
  id: string;
  patientName: string;
  hasNotificationDot?: boolean;
  caseId: string;
  need: string;
  stage: string;
  status: 'New' | 'Active' | 'Awaiting Info' | 'Closed';
  priority: 'Normal' | 'Urgent';
  coordinator: string;
  updated: string;
  rawCreatedAt: string;
}

type StatusFilter = 'All' | 'New' | 'Active' | 'Awaiting Info' | 'Closed';

export default function PatientCasesPage() {
  const supabase = createClient();

  const [cases, setCases] = useState<PatientCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<StatusFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Debounce search query to reduce unnecessary backend requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Helper to format timestamps into relative or clean strings
  const formatUpdatedTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Fetch Cases from Supabase with Backend Filtering
  const fetchCases = useCallback(async () => {
    setLoading(true);

    try {
      let query = supabase
        .from('cases')
        .select(`
          id,
          case_number,
          need,
          stage,
          workflow_stage,
          status,
          priority,
          coordinator_id,
          created_at,
          updated_at,
          user_id,
          patient:profiles!user_id (
            full_name
          ),
          coordinator:profiles!coordinator_id (
            full_name
          )
        `);

      // 1. Status Filter (Backend)
      if (selectedFilter !== 'All') {
        query = query.eq('status', selectedFilter);
      }

      // 2. Date Range Filters (Backend)
      if (startDate) {
        const [day, month, year] = startDate.split('/');
        if (day && month && year) {
          const isoStart = new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString();
          query = query.gte('created_at', isoStart);
        }
      }

      if (endDate) {
        const [day, month, year] = endDate.split('/');
        if (day && month && year) {
          const isoEnd = new Date(`${year}-${month}-${day}T23:59:59.999Z`).toISOString();
          query = query.lte('created_at', isoEnd);
        }
      }

      // 3. Search Query Filter
      if (debouncedSearch.trim()) {
        const term = `%${debouncedSearch.trim()}%`;
        query = query.or(`case_number.ilike.${term},need.ilike.${term}`);
      }

      // 4. Order results
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching patient cases:', error.message);
        return;
      }

      if (data) {
        const mappedCases: PatientCase[] = data.map((c: any) => {
          const patientObj = Array.isArray(c.patient) ? c.patient[0] : c.patient;
          const coordObj = Array.isArray(c.coordinator) ? c.coordinator[0] : c.coordinator;

          return {
            id: c.id,
            patientName: patientObj?.full_name || 'Patient',
            caseId: c.case_number || `CASE-${c.id.slice(0, 8).toUpperCase()}`,
            need: c.need || 'General Guidance',
            stage: c.workflow_stage || c.stage || 'Consultation Submitted',
            status: (c.status as any) || 'New',
            priority: (c.priority as any) || 'Normal',
            coordinator: coordObj?.full_name || 'Unassigned',
            updated: formatUpdatedTime(c.updated_at || c.created_at),
            rawCreatedAt: c.created_at,
            hasNotificationDot: c.status === 'New',
          };
        });

        setCases(mappedCases);
      }
    } catch (err) {
      console.error('Unexpected error loading cases:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase, selectedFilter, debouncedSearch, startDate, endDate]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const getStatusBadge = (status: PatientCase['status']) => {
    switch (status) {
      case 'New':
        return (
          <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-1 rounded-full inline-block text-center">
            New
          </span>
        );
      case 'Active':
        return (
          <span className="bg-[#DCFCE7] text-[#15803D] font-semibold text-xs px-3 py-1 rounded-full inline-block text-center">
            Active
          </span>
        );
      case 'Awaiting Info':
        return (
          <span className="bg-[#FEF3C7] text-[#B45309] font-semibold text-xs px-3 py-1 rounded-full inline-block text-center">
            Awaiting Info
          </span>
        );
      case 'Closed':
        return (
          <span className="bg-slate-100 text-slate-500 font-semibold text-xs px-3 py-1 rounded-full inline-block text-center">
            Closed
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: PatientCase['priority']) => {
    if (priority === 'Urgent') {
      return (
        <span className="bg-[#FEE2E2] text-[#DC2626] font-semibold text-xs px-3 py-1 rounded-full inline-block text-center">
          Urgent
        </span>
      );
    }
    return <span className="text-xs text-slate-500">{priority}</span>;
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A8A] mb-1">Patient Cases</h1>
        <p className="text-slate-500 text-sm">
          {cases.length} total cases fetched.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Status Pill Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {(['All', 'New', 'Active', 'Awaiting Info', 'Closed'] as StatusFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-[#1D4ED8] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}

          {/* Date Pickers */}
          <div className="flex items-center gap-2 ml-0 lg:ml-2">
            <div className="relative flex items-center bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-500">
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-24 outline-none text-slate-700 bg-transparent"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
            <span className="text-xs text-slate-400 font-medium">to</span>
            <div className="relative flex items-center bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-500">
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-24 outline-none text-slate-700 bg-transparent"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, case ID, or need."
            className="w-full bg-white border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-12 w-full">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
              <span className="text-sm text-slate-500">Loading patient cases...</span>
            </div>
          ) : cases.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              No patient cases match your query.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Patient</th>
                  <th className="py-3.5 px-4">Case ID</th>
                  <th className="py-3.5 px-4">Need</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Priority</th>
                  <th className="py-3.5 px-4">Coordinator</th>
                  <th className="py-3.5 px-4">Updated</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-6 font-bold text-slate-800 whitespace-nowrap">
                      <Link href={`/admin/cases/${c.id}`} className="inline-flex items-center gap-1.5 hover:text-blue-700">
                        <span>{c.patientName}</span>
                        {c.hasNotificationDot && (
                          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        )}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                      {c.caseId}
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {c.need}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-800 border border-blue-100">
                        {c.stage}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      {getStatusBadge(c.status)}
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      {getPriorityBadge(c.priority)}
                    </td>
                    <td className="py-4 px-4 font-semibold whitespace-nowrap">
                      {c.coordinator === 'Unassigned' ? (
                        <span className="text-red-500">{c.coordinator}</span>
                      ) : (
                        <span className="text-slate-700">{c.coordinator}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400 font-medium whitespace-nowrap">
                      {c.updated}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/cases/${c.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 group-hover:text-blue-700 hover:underline"
                      >
                        Manage <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}