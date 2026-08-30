'use client';

import React, { useState } from 'react';
import { Check, Plus, File, X, Loader2 } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';

const STEPS = [
  { id: 1, label: 'About You' },
  { id: 2, label: 'Your Situation' },
  { id: 3, label: 'Medical Details' },
  { id: 4, label: 'Documents' },
  { id: 5, label: 'Preferences' },
  { id: 6, label: 'Consent' },
];

interface StepFourProps {
  onNext?: (data: any) => void;
  onBack?: () => void;
  caseId?: string;
}

export default function StepFourDocuments({
  onNext,
  onBack,
  caseId,
}: StepFourProps) {
  const supabase = createClient();

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User session not found. Please re-authenticate.');
      }

      if (!caseId) {
        throw new Error('Missing case context. Please complete step 2 first.');
      }

      const uploadedFilesMetaData: Array<{ name: string; path: string; size: number; mimeType: string }> = [];

      // Upload each file to Supabase Storage bucket 'case-documents'
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Uploading file ${i + 1} of ${files.length}: ${file.name}`);

        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${caseId}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }

        uploadedFilesMetaData.push({
          name: file.name,
          path: filePath,
          size: file.size,
          mimeType: file.type,
        });
      }

      // Record documents metadata in database if files were uploaded.
      // Written to public.documents — the same table your admin dashboard
      // already reads for "Documents Pending Review" and "Recent Activity".
      // (public.case_documents doesn't exist in your schema; this used to
      // point at it and would have failed on every upload.)
      if (uploadedFilesMetaData.length > 0) {
        const documentRecords = uploadedFilesMetaData.map((meta) => ({
          case_id: caseId,
          user_id: user.id,
          name: meta.name,
          file_path: meta.path,
          file_size: meta.size,
          mime_type: meta.mimeType,
        }));

        const { error: dbError } = await supabase
          .from('documents')
          .insert(documentRecords);

        if (dbError) throw dbError;
      }

      if (onNext) {
        onNext({
          caseId,
          documentsUploaded: uploadedFilesMetaData,
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during file upload.');
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
          Start Your Healthcare Journey
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
          Let's understand how we can support you.
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          Every healthcare journey is different. Share some details, and our team will review your needs and guide you toward next steps. Takes about 5 minutes.
        </p>

        {/* Stepper Header Bar */}
        <div className="pt-8 pb-10">
          <div className="flex items-center justify-between relative max-w-2xl mx-auto px-2">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

            {STEPS.map((step) => {
              const isCompleted = step.id < 4;
              const isActive = step.id === 4;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center group">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isActive
                        ? 'border-2 border-emerald-600 bg-white text-emerald-700 ring-4 ring-emerald-50'
                        : 'border border-slate-300 bg-white text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium whitespace-nowrap hidden sm:block ${
                      isActive ? 'text-emerald-700 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content Card */}
      <div className="max-w-2xl mx-auto space-y-6">
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        {uploadProgress && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-medium flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span>{uploadProgress}</span>
          </div>
        )}

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Upload supporting medical documents
            </h3>
            <p className="text-xs text-slate-500">
              Medical reports, scan results, lab reports, doctor letters, or short videos. Optional — you can continue without uploading now.
            </p>
          </div>

          {/* File Drag and Drop Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all bg-slate-50/50 relative flex flex-col items-center justify-center space-y-3 ${
              isDragging ? 'border-emerald-600 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="file"
              multiple
              disabled={loading}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.heic,.docx,.mp4,.mov"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />

            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white text-emerald-600 shadow-sm pointer-events-none">
              <Plus className="w-5 h-5" />
            </div>

            <div className="space-y-1 pointer-events-none">
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                <span className="text-emerald-600 font-bold hover:underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-[11px] sm:text-xs text-slate-400 max-w-xs sm:max-w-md mx-auto leading-relaxed">
                PDF, JPG, PNG, HEIC, DOCX, MP4 or MOV — max 25MB each. You can select multiple files at once.
              </p>
            </div>
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700">Attached files:</span>
              <div className="space-y-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <File className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="font-medium text-slate-700 truncate">{file.name}</span>
                      <span className="text-slate-400 text-[10px]">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => removeFile(idx)}
                      className="text-slate-400 hover:text-red-500 p-1 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-slate-400 leading-relaxed pt-2">
            Your documents are securely stored and only accessed by authorized HealingWays personnel reviewing your case.
          </p>

        </div>

        {/* Navigation Buttons Row */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="text-sm font-bold text-blue-900 hover:text-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Uploading...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}