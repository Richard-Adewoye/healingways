'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FileText, Image as ImageIcon, Lightbulb, Loader2 } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';

interface DocumentItem {
  id: string;
  filename: string;
  type: 'pdf' | 'image';
  patientName: string;
  caseId: string;
  category: string;
  date: string;
  status: 'Uploaded' | 'Under Review' | 'Accepted' | 'Update Requested';
  statusBg: string;
  statusText: string;
  note?: string;
  feedback?: string;
  filePath: string;
}

export default function DocumentReviewPage() {
  const supabase = createClient();

  const [pendingDocs, setPendingDocs] = useState<DocumentItem[]>([]);
  const [resolvedDocs, setResolvedDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Format creation timestamp
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) return 'Today';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Detect file type from mime_type or file extension
  const getFileType = (mimeType?: string, fileName?: string): 'pdf' | 'image' => {
    if (mimeType?.startsWith('image/')) return 'image';
    if (fileName && /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName)) return 'image';
    return 'pdf';
  };

  // Fetch documents from Supabase
  const fetchDocuments = useCallback(async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          id,
          user_id,
          case_id,
          name,
          file_path,
          file_size,
          mime_type,
          created_at,
          profiles!user_id (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents for review:', error.message);
        return;
      }

      if (data) {
        const pending: DocumentItem[] = [];
        const resolved: DocumentItem[] = [];

        data.forEach((doc: any) => {
          const fileType = getFileType(doc.mime_type, doc.name);
          const patientName = doc.profiles?.full_name || 'Unknown Patient';
          const caseId = doc.case_id || `CASE-${doc.id.slice(0, 8).toUpperCase()}`;

          // Map document into item format (Defaults to 'Uploaded' / Pending state)
          const item: DocumentItem = {
            id: doc.id,
            filename: doc.name || 'Untitled Document',
            type: fileType,
            patientName,
            caseId,
            category: 'Medical Reports',
            date: formatDate(doc.created_at),
            status: 'Uploaded',
            statusBg: 'bg-slate-100',
            statusText: 'text-slate-700',
            filePath: doc.file_path,
          };

          // Group into Pending vs Resolved sections
          if (item.status === 'Uploaded' || item.status === 'Under Review') {
            pending.push(item);
          } else {
            resolved.push(item);
          }
        });

        setPendingDocs(pending);
        setResolvedDocs(resolved);
      }
    } catch (err) {
      console.error('Unexpected error loading documents:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const renderDocumentCard = (doc: DocumentItem) => {
    const FileIcon = doc.type === 'image' ? ImageIcon : FileText;

    return (
      <div
        key={doc.id}
        className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4 min-w-0"
      >
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2 border border-slate-200 rounded-lg text-slate-500 bg-slate-50 shrink-0 mt-0.5">
              <FileIcon className="w-5 h-5" />
            </div>

            <div className="space-y-1 min-w-0">
              <h3 className="font-bold text-[#1E3A8A] text-sm sm:text-base hover:underline cursor-pointer break-all">
                {doc.filename}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {doc.patientName} &middot; {doc.caseId} &middot; {doc.category} &middot; {doc.date}
              </p>

              {/* Note callout */}
              {doc.note && (
                <div className="flex items-center gap-1.5 text-xs text-amber-700 pt-1">
                  <Lightbulb className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                  <span>{doc.note}</span>
                </div>
              )}
            </div>
          </div>

          <div className="self-start sm:self-auto shrink-0">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${doc.statusBg} ${doc.statusText}`}
            >
              {doc.status}
            </span>
          </div>
        </div>

        {/* Feedback block */}
        {doc.feedback && (
          <p className="text-xs italic text-slate-500 pl-2 border-l-2 border-slate-200">
            Feedback sent: &quot;{doc.feedback}&quot;
          </p>
        )}

        {/* Action Controls Row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
          <button className="flex-1 sm:flex-none border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold px-3.5 sm:px-4 py-2 sm:py-1.5 rounded-xl text-xs transition-colors text-center">
            Open &amp; Review
          </button>
          <button className="flex-1 sm:flex-none bg-[#22C55E] hover:bg-emerald-600 text-white font-semibold px-3.5 sm:px-4 py-2 sm:py-1.5 rounded-xl text-xs transition-colors text-center">
            Accept
          </button>
          <button className="w-full sm:w-auto border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold px-3.5 sm:px-4 py-2 sm:py-1.5 rounded-xl text-xs transition-colors text-center">
            Request Update
          </button>

          <Link
            href={`/admin/cases/${doc.caseId}`}
            className="text-xs font-bold text-[#1E3A8A] hover:underline py-1 sm:ml-auto block text-right w-full sm:w-auto"
          >
            Open Case &rarr;
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8 min-w-0 font-sans">
      {/* Page Title & Subtitle */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1E3A8A]">Document Review</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review documents uploaded by patients across every case, and let them know if anything needs fixing.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 w-full bg-white border border-slate-200 rounded-2xl">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
          <span className="text-sm text-slate-500">Loading documents...</span>
        </div>
      ) : (
        <>
          {/* Pending Reviews Section */}
          <div className="space-y-4">
            {pendingDocs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-white border border-slate-200 rounded-2xl">
                No pending documents to review.
              </div>
            ) : (
              pendingDocs.map((doc) => renderDocumentCard(doc))
            )}
          </div>

          {/* Recently Resolved Section */}
          {resolvedDocs.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                RECENTLY RESOLVED
              </h3>
              <div className="space-y-4">
                {resolvedDocs.map((doc) => renderDocumentCard(doc))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}