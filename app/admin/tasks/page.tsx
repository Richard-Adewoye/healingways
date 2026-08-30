'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  isAuto?: boolean;
  patientName: string;
  caseId: string;
  dueDate: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Prepare treatment plan for Al Noor Specialist Medical Center',
    isAuto: true,
    patientName: 'Amara Chukwu',
    caseId: 'HW-2026-531971',
    dueDate: 'Due Soon',
    completed: true,
  },
  {
    id: '2',
    title: 'Reply to message from Amara Chukwu',
    isAuto: true,
    patientName: 'Amara Chukwu',
    caseId: 'HW-2026-531971',
    dueDate: 'Due Soon',
    completed: true,
  },
  {
    id: '3',
    title: 'Begin case review for new patient',
    isAuto: true,
    patientName: 'Amara Chukwu',
    caseId: 'HW-2026-531971',
    dueDate: 'Due Soon',
    completed: true,
  },
  {
    id: '4',
    title: 'Review document: 2025_Day_1_Rewrite_v1_IntroductionToAgents.pdf',
    isAuto: true,
    patientName: 'Amara Chukwu',
    caseId: 'HW-2026-150088',
    dueDate: 'Due Soon',
    completed: false,
  },
  {
    id: '5',
    title: 'Begin case review for new patient',
    isAuto: true,
    patientName: 'Amara Chukwu',
    caseId: 'HW-2026-150088',
    dueDate: 'Due Soon',
    completed: false,
  },
  {
    id: '6',
    title: 'Confirm hospital recommendation with Lagoon Specialist Hospital',
    isAuto: false,
    patientName: 'Amara Chukwu',
    caseId: 'HW-2026-000145',
    dueDate: 'Due 27 Jul 2026',
    completed: false,
  },
  {
    id: '7',
    title: 'Follow up on uploaded Cardiac MRI report',
    isAuto: false,
    patientName: 'Amara Chukwu',
    caseId: 'HW-2026-000145',
    dueDate: 'Due 24 Jul 2026',
    completed: true,
  },
  {
    id: '8',
    title: 'Assign medical advisor for case review',
    isAuto: false,
    patientName: 'Fatima Al-Sayed',
    caseId: 'HW-2026-000901',
    dueDate: 'Due 26 Jul 2026',
    completed: false,
  },
  {
    id: '9',
    title: 'Assign case coordinator',
    isAuto: false,
    patientName: 'Chidinma Adeyemi',
    caseId: 'HW-2026-000934',
    dueDate: 'Due 26 Jul 2026',
    completed: false,
  },
  {
    id: '10',
    title: 'Verify visa documents received',
    isAuto: false,
    patientName: 'Ibrahim Diallo',
    caseId: 'HW-2026-000887',
    dueDate: 'Due 28 Jul 2026',
    completed: false,
  },
  {
    id: '11',
    title: 'Follow up if no response by Friday',
    isAuto: false,
    patientName: 'Grace Mensah',
    caseId: 'HW-2026-000956',
    dueDate: 'Due 29 Jul 2026',
    completed: false,
  },
  {
    id: '12',
    title: 'Urgent: assign coordinator and begin case review',
    isAuto: false,
    patientName: 'Adaeze Nwosu',
    caseId: 'HW-2026-001002',
    dueDate: 'Due 26 Jul 2026',
    completed: false,
  },
];

type FilterTab = 'All' | 'Open' | 'Done';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'Open') return !task.completed;
    if (activeTab === 'Done') return task.completed;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 min-w-0">
      {/* Title Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1E3A8A]">Tasks</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Everything your team needs to action, across every case.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['All', 'Open', 'Done'] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-[#1E3A8A] text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 transition-all hover:shadow-md min-w-0"
          >
            <div className="flex items-start gap-3 min-w-0">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
                className="mt-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-[#2563EB]"
              />

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-xs sm:text-sm font-semibold transition-all break-words ${
                      task.completed
                        ? 'line-through text-slate-400 font-normal'
                        : 'text-slate-800'
                    }`}
                  >
                    {task.title}
                  </span>

                  {task.isAuto && (
                    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 shrink-0">
                      <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                      Auto
                    </span>
                  )}
                </div>

                <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed">
                  {task.patientName} &middot; {task.caseId} &middot; {task.dueDate}
                </p>
              </div>
            </div>

            <Link
              href={`/admin/cases/${task.caseId}`}
              className="text-xs font-bold text-[#1E3A8A] hover:underline shrink-0 self-end sm:self-start sm:mt-0.5 pl-7 sm:pl-0"
            >
              Open Case &rarr;
            </Link>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center text-slate-400 text-xs sm:text-sm">
            No tasks found in this section.
          </div>
        )}
      </div>
    </div>
  );
}