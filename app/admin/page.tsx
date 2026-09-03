'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SendHorizontal, ShieldAlert, Loader2, ArrowRight, UserCheck, FileText, CheckCircle2 } from 'lucide-react';
import { 
  getAllCasesForAdmin, 
  PatientCase 
} from '@/app/lib/firebase/services';

interface ActivityItem {
  id: string;
  name: string;
  status: string;
  statusBg: string;
  department: string;
  stage: string;
  time: string;
}

interface UrgentCase {
  id: string;
  name: string;
  specialty: string;
  coordinator: string;
  isUnassigned?: boolean;
}

interface WorkloadItem {
  name: string;
  casesCount: number;
  isUnassigned?: boolean;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'New Consultations', value: 0, color: 'text-blue-600' },
    { label: 'Active Cases', value: 0, color: 'text-emerald-600' },
    { label: 'Awaiting Patient Info', value: 0, color: 'text-amber-500' },
    { label: 'Documents Pending Review', value: 0, color: 'text-blue-500' },
    { label: 'Open Tasks', value: 0, color: 'text-blue-600' },
  ]);

  const [urgentCases, setUrgentCases] = useState<UrgentCase[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [workload, setWorkload] = useState<WorkloadItem[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      try {
        const cases = await getAllCasesForAdmin();

        const newCount = cases.filter((c) => c.status === 'New').length;
        const activeCount = cases.filter((c) => c.status === 'In Progress' || c.status === 'Under Review' || c.status === 'Scheduled').length;
        const awaitingCount = cases.filter((c) => !c.review_accepted || !c.itinerary_confirmed_by_patient).length;
        
        let totalDocs = 0;
        cases.forEach((c) => {
          if (c.documents) totalDocs += c.documents.length;
        });

        setStats([
          { label: 'New Consultations', value: newCount, color: 'text-blue-600' },
          { label: 'Active Cases', value: activeCount, color: 'text-emerald-600' },
          { label: 'Awaiting Action', value: awaitingCount, color: 'text-amber-500' },
          { label: 'Verified Records', value: totalDocs, color: 'text-blue-500' },
          { label: 'Open Tasks', value: newCount + awaitingCount, color: 'text-blue-600' },
        ]);

        // Recent activity
        const activities: ActivityItem[] = [];
        cases.slice(0, 5).forEach((c, idx) => {
          activities.push({
            id: c.id || `act-${idx}`,
            name: c.patient_name || 'Patient',
            status: c.status || 'Active',
            statusBg: c.status === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800',
            department: c.need || 'Consultation',
            stage: c.workflow_stage || c.stage || 'Case Review',
            time: new Date(c.updated_at || c.created_at).toLocaleDateString(),
          });
        });
        setRecentActivity(activities);

        // Urgent Cases
        const urgent = cases.slice(0, 4).map((c) => ({
          id: c.id,
          name: c.patient_name || 'Patient',
          specialty: c.need || 'General Care',
          coordinator: c.coordinator_name || 'Sarah James',
          isUnassigned: !c.coordinator_name,
        }));
        setUrgentCases(urgent);

        // Workload
        const coordinatorMap: { [key: string]: number } = {
          'Sarah James': 0,
          'Dr. Elena Vance': 0,
          'Marcus Chen': 0,
        };
        cases.forEach((c) => {
          const name = c.coordinator_name || 'Sarah James';
          coordinatorMap[name] = (coordinatorMap[name] || 0) + 1;
        });

        setWorkload(
          Object.entries(coordinatorMap).map(([name, count]) => ({
            name,
            casesCount: count,
          }))
        );
      } catch (err) {
        console.error('Error loading admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 font-sans max-w-7xl mx-auto w-full p-4 sm:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Admin Overview</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time operations, case workflows, and patient intake coordination.
          </p>
        </div>
        <Link
          href="/admin/patient-cases"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors w-full sm:w-auto"
        >
          <span>View All Cases</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Row */}
      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 text-blue-900 animate-spin mr-2" />
          <span className="text-xs sm:text-sm text-slate-500">Loading metrics...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 block leading-tight">{stat.label}</span>
              <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${stat.color}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Urgent Attention Cases */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" /> Urgent Action Required
            </h2>
            <Link href="/admin/patient-cases" className="text-xs font-semibold text-emerald-700 hover:underline">
              All Cases →
            </Link>
          </div>

          <div className="space-y-3">
            {urgentCases.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No urgent cases flagged</p>
            ) : (
              urgentCases.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs font-bold text-blue-900 truncate">{c.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{c.specialty}</p>
                    <p className="text-[10px] text-slate-400">Coord: {c.coordinator}</p>
                  </div>
                  <Link
                    href={`/admin/cases/${c.id}`}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-600 hover:text-emerald-700 text-[11px] font-semibold rounded-lg transition-colors shrink-0"
                  >
                    Manage
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-bold text-slate-800">Recent Workflow Activity</h2>
            <span className="text-[11px] text-slate-400 font-medium">Live Synced</span>
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivity.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No recent activity logged</p>
            ) : (
              recentActivity.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-900">{act.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${act.statusBg}`}>
                        {act.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] truncate">{act.department} · Current Stage: {act.stage}</p>
                  </div>
                  <span className="text-slate-400 text-[10px] shrink-0">{act.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Team Workload */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800">Care Coordinator Workload Allocation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {workload.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-blue-900">{item.name}</h4>
                <p className="text-[11px] text-slate-500">Active Healthcare Cases</p>
              </div>
              <span className="text-lg font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                {item.casesCount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
