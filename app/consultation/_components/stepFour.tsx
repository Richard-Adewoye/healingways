'use client';

import React, { useState } from 'react';
import { Plus, File, X, Loader2, Upload } from 'lucide-react';
import { auth } from '@/app/lib/firebase/client';
import { saveCaseDocument } from '@/app/lib/firebase/services';

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
    e.stopPropagation();
    console.log('handleSubmit (Step 4) called');
    setErrorMsg(null);
    setLoading(true);

    try {
      const user = auth.currentUser;
      const effectiveUserId = user?.uid || `patient_guest`;

      const uploadedFilesMetaData: Array<{ name: string; path: string; size: number; mimeType: string }> = [];

      if (files.length > 0 && caseId) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          setUploadProgress(`Processing file ${i + 1} of ${files.length}: ${file.name}`);

          try {
            const savedDoc = await saveCaseDocument({
              caseId,
              userId: effectiveUserId,
              name: file.name,
              fileSize: file.size,
              fileType: file.type || 'application/pdf',
              category: 'Clinical Record',
            });

            uploadedFilesMetaData.push({
              name: file.name,
              path: savedDoc.id,
              size: file.size,
              mimeType: file.type,
            });
          } catch (docErr) {
            console.warn('Doc upload notice:', docErr);
            uploadedFilesMetaData.push({
              name: file.name,
              path: `doc_${Date.now()}_${i}`,
              size: file.size,
              mimeType: file.type,
            });
          }
        }
      }

      if (onNext) {
        onNext({
          caseId,
          documentsUploaded: uploadedFilesMetaData,
        });
      }
    } catch (err: any) {
      console.error('Step 4 error:', err);
      if (onNext) {
        onNext({ caseId, documentsUploaded: [] });
      }
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xss font-semibold rounded-full border border-emerald-100">
          Start Your Healthcare Journey
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
          Upload medical records &amp; scans.
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          Attaching recent MRI, CT scans, blood tests, or doctor referrals helps us review your case with hospital boards quickly. (Optional at this stage)
        </p>

        {/* Stepper Header Bar */}
        <div className="pt-8 pb-10">
          <div className="flex items-center justify-between relative max-w-2xl mx-auto px-2">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

            {STEPS.map((step) => {
              const isActive = step.id === 4;
              const isPast = step.id < 4;
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center group">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xss font-bold transition-all ${
                      isActive
                        ? 'border-2 border-emerald-600 bg-white text-emerald-700 ring-4 ring-emerald-50'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 bg-white text-slate-500'
                    }`}
                  >
                    {step.id}
                  </div>
                  <span
                    className={`mt-2 text-xss font-medium whitespace-nowrap hidden sm:block ${
                      isActive ? 'text-emerald-700 font-bold' : 'text-slate-500'
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

      {/* Main Form Card */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-10 mt-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              isDragging
                ? 'border-emerald-600 bg-emerald-50/50'
                : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Click to browse or drag and drop files here
                </p>
                <p className="text-xss text-slate-500 mt-1">
                  PDF, DICOM, JPEG, PNG, DOCX up to 50MB each
                </p>
              </div>
              <label className="cursor-pointer px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-xss rounded-lg hover:bg-slate-100 transition-all shadow-sm">
                Choose Files
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.dicom"
                />
              </label>
            </div>
          </div>

          {/* Uploaded File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800">
                Selected Files ({files.length})
              </label>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white flex items-center justify-between gap-3 text-xss"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <File className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium text-slate-700 truncate">{file.name}</span>
                      <span className="text-slate-400 shrink-0">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploadProgress && (
            <div className="flex items-center gap-2 text-xss text-emerald-700 bg-emerald-50 p-3 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>{uploadProgress}</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 flex items-center justify-between gap-4">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3.5 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Files...
                </>
              ) : files.length > 0 ? (
                'Save & Continue to Step 5'
              ) : (
                'Skip / Continue to Step 5'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
