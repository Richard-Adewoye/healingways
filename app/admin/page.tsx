'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SendHorizontal, ShieldAlert, Loader2 } from 'lucide-react';
import { createClient } from '../utils/supabase/client';

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
  const supabase = createClient();

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
        // 1. Parallel Count Queries using correct column 'status'.
        // "New Consultations" now requires submitted_at IS NOT NULL, so a
        // case the patient abandoned mid-wizard (created in Step 2, never
        // reached Step 6) doesn't get counted as a real consultation.
        const [
          { count: newCount },
          { count: activeCount },
          { count: awaitingCount },
          { count: docsCount },
        ] = await Promise.all([
          supabase
            .from('cases')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'New')
            .not('submitted_at', 'is', null),
          supabase.from('cases').select('*', { count: 'exact', head: true }).eq('status', 'Active'),
          supabase.from('cases').select('*', { count: 'exact', head: true }).eq('status', 'Awaiting Info'),
          supabase.from('documents').select('*', { count: 'exact', head: true }),
        ]);

        setStats([
          { label: 'New Consultations', value: newCount || 0, color: 'text-blue-600' },
          { label: 'Active Cases', value: activeCount || 0, color: 'text-emerald-600' },
          { label: 'Awaiting Patient Info', value: awaitingCount || 0, color: 'text-amber-500' },
          { label: 'Documents Pending Review', value: docsCount || 0, color: 'text-blue-500' },
          { label: 'Open Tasks', value: (newCount || 0) + (awaitingCount || 0), color: 'text-blue-600' },
        ]);

        // 2. Fetch Recent Document Activity & profiles
        const { data: recentDocs } = await supabase
          .from('documents')
          .select(`
            id,
            name,
            created_at,
            user_id,
            profiles!user_id ( full_name )
          `)
          .order('created_at', { ascending: false })
          .limit(6);

        if (recentDocs && recentDocs.length > 0) {
          const mappedActivity: ActivityItem[] = recentDocs.map((doc: any, idx: number) => ({
            id: doc.id || `doc-${idx}`,
            name: doc.profiles?.full_name || 'Patient',
            status: 'Submitted',
            statusBg: 'bg-emerald-100 text-emerald-800',
            department: doc.name || 'General Document',
            stage: 'Document Uploaded',
            time: doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'N/A',
          }));

          setRecentActivity(mappedActivity);
        }

        // 3. Fetch Cases with Joined Patient & Coordinator Profiles
        const { data: casesData } = await supabase
          .from('cases')
          .select(`
            id,
            need,
            patient:profiles!user_id ( full_name ),
            coordinator:profiles!coordinator_id ( full_name )
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (casesData) {
          const mappedUrgent: UrgentCase[] = casesData.map((c: any, idx: number) => {
            const patientObj = Array.isArray(c.patient) ? c.patient[0] : c.patient;
            const coordObj = Array.isArray(c.coordinator) ? c.coordinator[0] : c.coordinator;

            return {
              id: c.id || `case-${idx}`,
              name: patientObj?.full_name || 'Unknown Patient',
              specialty: c.need || 'General Guidance',
              coordinator: coordObj?.full_name || 'Unassigned',
              isUnassigned: !coordObj?.full_name,
            };
          });
          setUrgentCases(mappedUrgent);
        }

        // 4. Calculate Team Workload from Active Cases
        const { data: workloadCases } = await supabase
          .from('cases')
          .select(`
            id,
            coordinator:profiles!coordinator_id ( full_name )
          `);

        if (workloadCases) {
          const workloadMap: Record<string, { count: number; isUnassigned: boolean }> = {};

          workloadCases.forEach((c: any) => {
            const coordObj = Array.isArray(c.coordinator) ? c.coordinator[0] : c.coordinator;
            const coordinatorName = coordObj?.full_name || 'Unassigned';
            const isUnassigned = !coordObj?.full_name;

            if (!workloadMap[coordinatorName]) {
              workloadMap[coordinatorName] = { count: 0, isUnassigned };
            }
            workloadMap[coordinatorName].count += 1;
          });

          const mappedWorkload: WorkloadItem[] = Object.entries(workloadMap).map(
            ([name, info]) => ({
              name,
              casesCount: info.count,
              isUnassigned: info.isUnassigned,
            })
          );

          setWorkload(mappedWorkload);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Welcome Banner */}
      <div>
        <h2 className="text-3xl font-bold text-[#1E3A8A]">Good to see you, Admin.</h2>
        <p className="text-sm text-slate-500 mt-1">
          Here&apos;s what&apos;s happening across your caseload today.
        </p>
      </div>

      {/* Service Live Alert */}
      <div className="bg-[#EBF7F0] border border-emerald-200/60 rounded-xl p-4 flex items-center gap-3 text-emerald-900 text-sm">
        <SendHorizontal className="w-5 h-5 text-emerald-600 shrink-0 rotate-[-30deg]" />
        <p>
          <span className="font-semibold">New service live: Flight Booking & Scheduling</span> &mdash; patients get up to 5% off all flights. Let your patients know when discussing travel plans.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div key={`stat-${stat.label}-${idx}`} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
            <span className="text-xs font-medium text-slate-500 leading-tight">
              {stat.label}
            </span>
            <span className={`text-3xl font-extrabold mt-4 ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Urgent Cases Alert Box */}
      <div className="bg-[#FEF2F2] border border-red-100 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
          <ShieldAlert className="w-5 h-5" />
          <span>{urgentCases.length} cases requiring attention</span>
        </div>

        <div className="space-y-2 pt-1">
          {urgentCases.length === 0 ? (
            <p className="text-xs text-slate-500">No cases currently requiring attention.</p>
          ) : (
            urgentCases.map((c, idx) => (
              <div key={c.id || `urgent-case-${idx}`} className="flex items-center justify-between text-sm py-1 border-b border-red-100/60 last:border-0">
                <span className="text-slate-600">
                  <strong className="text-slate-800 font-medium">{c.name}</strong> &mdash; {c.specialty} &middot;{' '}
                  <span className={c.isUnassigned ? 'text-red-600 font-semibold' : 'text-slate-600'}>
                    {c.coordinator}
                  </span>
                </span>
                <Link href={`/admin/cases/${c.id}`} className="text-xs font-bold text-[#1E3A8A] hover:underline">
                  Open &rarr;
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Grid: Recent Activity & Team Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Activity Column */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-4">
            RECENT ACTIVITY
          </h3>

          <div className="divide-y divide-slate-100">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">No recent activity recorded.</p>
            ) : (
              recentActivity.map((item, idx) => (
                <div key={item.id || `activity-${idx}`} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.statusBg}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {item.department} &middot; {item.stage}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{item.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Team Workload Column */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2">
            TEAM WORKLOAD
          </h3>

          <div className="space-y-3">
            {workload.length === 0 ? (
              <p className="text-xs text-slate-500">No active workload data available.</p>
            ) : (
              workload.map((member, idx) => (
                <div key={`workload-${member.name}-${idx}`} className="flex items-center justify-between text-sm py-1 border-b border-slate-100 last:border-0">
                  <span className={`font-semibold ${member.isUnassigned ? 'text-red-600' : 'text-slate-700'}`}>
                    {member.name}
                  </span>
                  <span className="bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full text-xs">
                    {member.casesCount} {member.casesCount === 1 ? 'case' : 'cases'}
                  </span>
                </div>
              ))
            )}
          </div>

          <Link
            href="/admin/cases?filter=unassigned"
            className="block w-full mt-4 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors text-center"
          >
            Assign unassigned cases
          </Link>
        </div>
      </div>
    </div>
  );
}