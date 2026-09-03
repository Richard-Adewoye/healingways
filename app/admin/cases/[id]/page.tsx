'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  FileText,
  Check,
  X,
  Plus,
  Lock,
  Building2,
  Plane,
  ClipboardList,
  MessageSquareText,
  CheckCircle2,
  Clock,
  MapPinned,
  BedDouble,
  Activity,
  Send,
  AlertCircle
} from 'lucide-react';
import { 
  getCaseById, 
  updatePatientCase, 
  adminSubmitCaseReview,
  adminSetRecommendedHospitals,
  adminSetMedicalItinerary,
  adminSetAccommodationAndVisa,
  adminSetTravelDetails,
  addTreatmentUpdate,
  DEFAULT_HOSPITALS,
  DEFAULT_COORDINATORS,
  PatientCase,
  Hospital 
} from '@/app/lib/firebase/services';

export default function AdminCaseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const caseId = params?.id;

  const [loading, setLoading] = useState(true);
  const [caseRecord, setCaseRecord] = useState<PatientCase | null>(null);

  // Editing state for sections
  const [reviewInput, setReviewInput] = useState('');
  const [savingReview, setSavingReview] = useState(false);

  const [selectedHospIds, setSelectedHospIds] = useState<string[]>([]);
  const [savingHospitals, setSavingHospitals] = useState(false);

  const [itineraryInput, setItineraryInput] = useState('');
  const [savingItinerary, setSavingItinerary] = useState(false);

  const [accommodationInput, setAccommodationInput] = useState('');
  const [visaInput, setVisaInput] = useState('');
  const [savingAccom, setSavingAccom] = useState(false);

  const [flightInput, setFlightInput] = useState('');
  const [savingFlight, setSavingFlight] = useState(false);

  const [treatmentTitle, setTreatmentTitle] = useState('');
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [savingTreatment, setSavingTreatment] = useState(false);

  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchCase = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    try {
      const c = await getCaseById(caseId);
      if (c) {
        setCaseRecord(c);
        setReviewInput(c.review_text || '');
        setSelectedHospIds((c.recommended_hospitals || []).map((h) => h.id));
        setItineraryInput(c.itinerary_notes || '');
        setAccommodationInput(c.accommodation_details || '');
        setVisaInput(c.visa_details || '');
        setFlightInput(c.flight_details || '');
      }
    } catch (err) {
      console.error('Error fetching case detail:', err);
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  // Stage 2: Submit Case Review
  const handleSaveReview = async () => {
    if (!caseRecord || !reviewInput.trim()) return;
    setSavingReview(true);
    try {
      await adminSubmitCaseReview(caseRecord.id, reviewInput.trim());
      setFeedbackMsg({ text: 'Clinical review published for patient.', type: 'success' });
      await fetchCase();
    } catch (err: any) {
      setFeedbackMsg({ text: err.message || 'Failed to save review', type: 'error' });
    } finally {
      setSavingReview(false);
    }
  };

  // Stage 3: Save Recommended Hospitals
  const handleSaveHospitals = async () => {
    if (!caseRecord) return;
    setSavingHospitals(true);
    try {
      const matched = DEFAULT_HOSPITALS.filter((h) => selectedHospIds.includes(h.id));
      await adminSetRecommendedHospitals(caseRecord.id, matched);
      setFeedbackMsg({ text: 'Hospital recommendations updated.', type: 'success' });
      await fetchCase();
    } catch (err: any) {
      setFeedbackMsg({ text: err.message || 'Failed to save hospitals', type: 'error' });
    } finally {
      setSavingHospitals(false);
    }
  };

  // Stage 4: Save Medical Itinerary
  const handleSaveItinerary = async () => {
    if (!caseRecord || !itineraryInput.trim()) return;
    setSavingItinerary(true);
    try {
      await adminSetMedicalItinerary(caseRecord.id, itineraryInput.trim());
      setFeedbackMsg({ text: 'Medical itinerary schedule updated.', type: 'success' });
      await fetchCase();
    } catch (err: any) {
      setFeedbackMsg({ text: err.message || 'Failed to save itinerary', type: 'error' });
    } finally {
      setSavingItinerary(false);
    }
  };

  // Stage 5: Save Accommodation & Visa
  const handleSaveAccomVisa = async () => {
    if (!caseRecord) return;
    setSavingAccom(true);
    try {
      await adminSetAccommodationAndVisa(caseRecord.id, accommodationInput.trim(), visaInput.trim());
      setFeedbackMsg({ text: 'Accommodation and visa details updated.', type: 'success' });
      await fetchCase();
    } catch (err: any) {
      setFeedbackMsg({ text: err.message || 'Failed to save accommodation & visa', type: 'error' });
    } finally {
      setSavingAccom(false);
    }
  };

  // Stage 6: Save Travel Details
  const handleSaveTravel = async () => {
    if (!caseRecord || !flightInput.trim()) return;
    setSavingFlight(true);
    try {
      await adminSetTravelDetails(caseRecord.id, flightInput.trim());
      setFeedbackMsg({ text: 'Flight and ground transfer logistics updated.', type: 'success' });
      await fetchCase();
    } catch (err: any) {
      setFeedbackMsg({ text: err.message || 'Failed to save flight details', type: 'error' });
    } finally {
      setSavingFlight(false);
    }
  };

  // Stage 7: Add Treatment Update
  const handleAddTreatment = async () => {
    if (!caseRecord || !treatmentTitle.trim() || !treatmentNotes.trim()) return;
    setSavingTreatment(true);
    try {
      await addTreatmentUpdate(caseRecord.id, {
        title: treatmentTitle.trim(),
        notes: treatmentNotes.trim(),
        authorName: caseRecord.coordinator_name || 'Sarah James',
        authorRole: 'Care Coordinator',
        date: new Date().toLocaleDateString('en-GB'),
      });
      setTreatmentTitle('');
      setTreatmentNotes('');
      setFeedbackMsg({ text: 'Treatment update published to patient portal.', type: 'success' });
      await fetchCase();
    } catch (err: any) {
      setFeedbackMsg({ text: err.message || 'Failed to add update', type: 'error' });
    } finally {
      setSavingTreatment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16 min-h-[400px]">
        <Loader2 className="w-6 h-6 text-blue-900 animate-spin mr-2" />
        <span className="text-sm font-medium text-slate-600">Loading case details...</span>
      </div>
    );
  }

  if (!caseRecord) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Case Not Found</h2>
        <Link href="/admin/patient-cases" className="text-emerald-700 font-semibold text-sm">
          ← Return to Cases Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 font-sans max-w-7xl mx-auto w-full p-4 sm:p-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Link
            href="/admin/patient-cases"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cases Directory
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-900">
              {caseRecord.patient_name} · <span className="text-slate-500 font-normal">{caseRecord.case_number}</span>
            </h1>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
              Stage: {caseRecord.workflow_stage || caseRecord.stage}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={caseRecord.coordinator_name || 'Sarah James'}
            onChange={async (e) => {
              const newCoord = e.target.value;
              await updatePatientCase(caseRecord.id, { coordinator_name: newCoord });
              await fetchCase();
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {DEFAULT_COORDINATORS.map((coord) => (
              <option key={coord.id} value={coord.full_name}>
                Coord: {coord.full_name}
              </option>
            ))}
          </select>

          <select
            value={caseRecord.status}
            onChange={async (e) => {
              const newStatus = e.target.value as any;
              await updatePatientCase(caseRecord.id, { status: newStatus });
              await fetchCase();
            }}
            className="px-3 py-1.5 text-xs font-bold bg-blue-900 text-white rounded-lg focus:outline-none"
          >
            <option value="New">Status: New</option>
            <option value="Under Review">Status: Under Review</option>
            <option value="In Progress">Status: In Progress</option>
            <option value="Scheduled">Status: Scheduled</option>
            <option value="Completed">Status: Completed</option>
          </select>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm font-medium ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Patient Intake Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b pb-2">
          Patient Intake &amp; Consultation Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Email / Phone</span>
            <p className="font-semibold text-slate-800">{caseRecord.patient_email || 'N/A'}</p>
            <p className="text-slate-500">{caseRecord.patient_phone || 'N/A'}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Age / Gender / Country</span>
            <p className="font-semibold text-slate-800">
              {caseRecord.age ? `${caseRecord.age} yrs` : 'N/A'} · {caseRecord.gender || 'N/A'}
            </p>
            <p className="text-slate-500">{caseRecord.country || 'USA'}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary Need / Area</span>
            <p className="font-semibold text-slate-800">{caseRecord.need}</p>
            <p className="text-slate-500">{caseRecord.healthcare_area || 'Orthopedics'}</p>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination &amp; Budget</span>
            <p className="font-semibold text-slate-800">{caseRecord.preferred_location || 'Flexible'}</p>
            <p className="text-slate-500">{caseRecord.budget || '$5,000 - $10,000'}</p>
          </div>
        </div>

        {caseRecord.situation && (
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
            <strong className="text-slate-800">Patient Description:</strong> {caseRecord.situation}
          </div>
        )}
      </div>

      {/* Sequential Milestone Modules */}
      <div className="space-y-6">
        
        {/* Stage 2 Module: Clinical Case Review */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 text-xs font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="text-sm font-bold text-blue-900">Stage 2: Doctor&apos;s Clinical Review &amp; Evaluation</h3>
            </div>
            {caseRecord.review_accepted ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Accepted by Patient
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Awaiting Patient Acceptance
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Enter the specialist&apos;s medical diagnosis, suitability assessment, and proposed procedure details.
          </p>

          <textarea
            rows={4}
            value={reviewInput}
            onChange={(e) => setReviewInput(e.target.value)}
            placeholder="e.g. Clinical assessment completed with senior orthopedic board. Candidate is well suited for bilateral computer-navigated knee arthroplasty..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-sans"
          />

          <button
            type="button"
            disabled={savingReview || !reviewInput.trim()}
            onClick={handleSaveReview}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {savingReview ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Save &amp; Publish Review</span>
          </button>
        </div>

        {/* Stage 3 Module: Hospital Recommendations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 text-xs font-bold flex items-center justify-center">
                3
              </div>
              <h3 className="text-sm font-bold text-blue-900">Stage 3: Hospital Recommendations</h3>
            </div>
            {caseRecord.selected_hospital_id ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Patient Selected Hospital
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                Pending Patient Selection
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Select the accredited healthcare centers presented to the patient for comparison and booking.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEFAULT_HOSPITALS.map((hosp) => {
              const isChecked = selectedHospIds.includes(hosp.id);
              return (
                <label
                  key={hosp.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    isChecked ? 'border-emerald-600 bg-emerald-50/40' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedHospIds([...selectedHospIds, hosp.id]);
                      } else {
                        setSelectedHospIds(selectedHospIds.filter((id) => id !== hosp.id));
                      }
                    }}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="text-xs font-bold text-blue-900 truncate">{hosp.name}</h4>
                    <p className="text-[11px] text-slate-500">{hosp.location} · {hosp.accreditation}</p>
                    <p className="text-[11px] font-semibold text-slate-700">{hosp.estimatedCost}</p>
                  </div>
                </label>
              );
            })}
          </div>

          <button
            type="button"
            disabled={savingHospitals}
            onClick={handleSaveHospitals}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {savingHospitals ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Building2 className="w-3.5 h-3.5" />}
            <span>Update Recommended Hospitals</span>
          </button>
        </div>

        {/* Stage 4 Module: Medical Itinerary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 text-xs font-bold flex items-center justify-center">
                4
              </div>
              <h3 className="text-sm font-bold text-blue-900">Stage 4: Medical Itinerary &amp; Timeline</h3>
            </div>
            {caseRecord.itinerary_confirmed_by_patient ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed by Patient
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                Awaiting Confirmation
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Define daily surgery slots, pre-op tests, inpatient recovery, and discharge consultations.
          </p>

          <textarea
            rows={4}
            value={itineraryInput}
            onChange={(e) => setItineraryInput(e.target.value)}
            placeholder="Day 1: Airport transfer & blood panel. Day 2: Surgical planning. Day 3: Robotic arthroplasty..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-mono"
          />

          <button
            type="button"
            disabled={savingItinerary || !itineraryInput.trim()}
            onClick={handleSaveItinerary}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {savingItinerary ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ClipboardList className="w-3.5 h-3.5" />}
            <span>Save Medical Itinerary</span>
          </button>
        </div>

        {/* Stage 5 Module: Accommodation & Visa */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 text-xs font-bold flex items-center justify-center">
                5
              </div>
              <h3 className="text-sm font-bold text-blue-900">Stage 5: Accommodation &amp; Visa Logistics</h3>
            </div>
            {caseRecord.accommodation_visa_confirmed_by_patient ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed by Patient
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                Awaiting Confirmation
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Hotel / Serviced Suite Details</label>
              <textarea
                rows={3}
                value={accommodationInput}
                onChange={(e) => setAccommodationInput(e.target.value)}
                placeholder="Partner suite name, room tier, duration, accessibility amenities..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Medical Visa Details &amp; Letters</label>
              <textarea
                rows={3}
                value={visaInput}
                onChange={(e) => setVisaInput(e.target.value)}
                placeholder="Visa category, hospital invitation letter status, consulate liaison..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={savingAccom}
            onClick={handleSaveAccomVisa}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {savingAccom ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BedDouble className="w-3.5 h-3.5" />}
            <span>Save Accommodation &amp; Visa</span>
          </button>
        </div>

        {/* Stage 6 Module: Travel & Flight Logistics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 text-xs font-bold flex items-center justify-center">
                6
              </div>
              <h3 className="text-sm font-bold text-blue-900">Stage 6: Travel Preparation &amp; Flights</h3>
            </div>
            {caseRecord.confirmed_by_patient ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Travel Confirmed
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                Awaiting Travel Readiness
              </span>
            )}
          </div>

          <textarea
            rows={3}
            value={flightInput}
            onChange={(e) => setFlightInput(e.target.value)}
            placeholder="Flight carrier, booking reference, airport ground escort assistance..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono"
          />

          <button
            type="button"
            disabled={savingFlight || !flightInput.trim()}
            onClick={handleSaveTravel}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {savingFlight ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plane className="w-3.5 h-3.5" />}
            <span>Save Travel Details</span>
          </button>
        </div>

        {/* Stage 7 Module: Treatment & Recovery Updates */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 text-xs font-bold flex items-center justify-center">
              7
            </div>
            <h3 className="text-sm font-bold text-blue-900">Stage 7: Treatment &amp; Post-Op Recovery Updates</h3>
          </div>

          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800">Post New Clinical Progress Log</h4>
            <input
              type="text"
              value={treatmentTitle}
              onChange={(e) => setTreatmentTitle(e.target.value)}
              placeholder="Update Title (e.g. Day 2 Post-Op Rehabilitation Milestones)"
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <textarea
              rows={3}
              value={treatmentNotes}
              onChange={(e) => setTreatmentNotes(e.target.value)}
              placeholder="Clinical details, physical therapy measurements, recovery notes..."
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="button"
              disabled={savingTreatment || !treatmentTitle.trim() || !treatmentNotes.trim()}
              onClick={handleAddTreatment}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {savingTreatment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Post Update to Patient</span>
            </button>
          </div>

          {/* Existing Updates Feed */}
          {caseRecord.treatment_updates && caseRecord.treatment_updates.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Published Recovery Logs</h4>
              {caseRecord.treatment_updates.map((upd) => (
                <div key={upd.id} className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-blue-900">{upd.title}</h5>
                    <span className="text-[10px] text-slate-400">{upd.date}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{upd.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
