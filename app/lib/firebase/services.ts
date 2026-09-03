import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from './client';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone?: string;
  age?: string;
  gender?: string;
  country?: string;
  state?: string;
  role: 'patient' | 'admin' | 'coordinator';
  createdAt?: string;
  updatedAt?: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  country?: string;
  specialties: string[];
  description: string;
  rating?: number;
  accreditation?: string;
  estimatedCost?: string;
  imageUrl?: string;
}

export interface CaseDocument {
  id: string;
  caseId: string;
  userId: string;
  name: string;
  fileSize?: number | string;
  fileType?: string;
  fileUrl?: string;
  category?: string;
  createdAt: string;
}

export interface TreatmentUpdate {
  id: string;
  caseId: string;
  title: string;
  notes: string;
  date: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
}

export interface PatientCase {
  id: string;
  case_number: string;
  user_id: string;
  patient_name: string;
  patient_email: string;
  patient_phone?: string;
  age?: string;
  gender?: string;
  country?: string;
  state?: string;
  need: string;
  support_type?: string;
  healthcare_area?: string;
  situation?: string;
  situation_description?: string;
  has_diagnosis?: string;
  diagnosis?: string;
  treatment_status?: string;
  care_outside_country?: string;
  preferred_destination?: string;
  preferred_location?: string;
  time_frame?: string;
  budget?: string;
  companions?: string;
  special_assistance?: string;
  notes?: string;
  stage: string;
  workflow_stage:
    | 'Consultation Submitted'
    | 'Case Review'
    | 'Hospital Recommendation'
    | 'Medical Itinerary'
    | 'Accommodation & Visa'
    | 'Travel Preparation'
    | 'Treatment & Recovery'
    | 'Completed';
  status: 'New' | 'Under Review' | 'In Progress' | 'Scheduled' | 'Completed' | 'Cancelled';
  priority: 'Normal' | 'Medium' | 'High' | 'Urgent';
  coordinator_id?: string | null;
  coordinator_name?: string | null;
  review_text?: string | null;
  review_accepted?: boolean;
  review_accepted_at?: string | null;
  selected_hospital_id?: string | null;
  selected_hospital?: Hospital | null;
  recommended_hospitals?: Hospital[];
  itinerary_notes?: string | null;
  itinerary_confirmed_by_patient?: boolean;
  accommodation_details?: string | null;
  visa_details?: string | null;
  accommodation_visa_confirmed_by_patient?: boolean;
  flight_details?: string | null;
  confirmed_by_patient?: boolean; // flight/travel confirmed
  created_at: string;
  updated_at: string;
  documents?: CaseDocument[];
  treatment_updates?: TreatmentUpdate[];
  consultation_for?: string;
  contact_name?: string;
}

// ----------------------------------------------------
// DEFAULT SEED HOSPITALS
// ----------------------------------------------------
export const DEFAULT_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'Apollo Hospital International',
    location: 'Chennai, India',
    country: 'India',
    specialties: ['Orthopedic Surgery', 'Cardiology', 'Oncology', 'Joint Replacement'],
    description: 'JCI Accredited multi-specialty center renowned for robotic knee and hip joint replacements with 99.4% clinical success rate.',
    rating: 4.9,
    accreditation: 'JCI & NABH Accredited',
    estimatedCost: '$6,500 - $8,200',
  },
  {
    id: 'hosp-2',
    name: 'Bumrungrad International Hospital',
    location: 'Bangkok, Thailand',
    country: 'Thailand',
    specialties: ['Spine Surgery', 'Robotic Surgery', 'Executive Wellness', 'Neurology'],
    description: 'World-leading medical tourism center offering cutting-edge minimally invasive procedures, dedicated multilingual international coordinators, and 5-star patient suites.',
    rating: 4.9,
    accreditation: 'JCI & GHA Certified',
    estimatedCost: '$8,800 - $11,500',
  },
  {
    id: 'hosp-3',
    name: 'Anadolu Medical Center',
    location: 'Istanbul, Turkey',
    country: 'Turkey',
    specialties: ['Oncology', 'Bone Marrow Transplant', 'Neurosurgery', 'Urology'],
    description: 'Affiliated with Johns Hopkins Medicine, offering world-class care in Istanbul with comprehensive diagnostic imaging and rehabilitation facilities.',
    rating: 4.8,
    accreditation: 'JCI & ESMO Accredited',
    estimatedCost: '$7,200 - $9,400',
  },
  {
    id: 'hosp-4',
    name: 'Mount Elizabeth Hospital',
    location: 'Singapore',
    country: 'Singapore',
    specialties: ['Cardiothoracic', 'Transplant Surgery', 'Precision Oncology'],
    description: 'Premier tertiary care hospital in South East Asia with distinguished surgical teams and advanced rehabilitation robotics.',
    rating: 4.9,
    accreditation: 'JCI Accredited',
    estimatedCost: '$12,000 - $16,000',
  },
];

export const DEFAULT_COORDINATORS = [
  { id: 'coord-1', full_name: 'Sarah James', email: 'sarah.james@healingways.com', role: 'Patient Care Coordinator' },
  { id: 'coord-2', full_name: 'Dr. Elena Vance', email: 'elena.vance@healingways.com', role: 'Clinical Travel Specialist' },
  { id: 'coord-3', full_name: 'Marcus Chen', email: 'marcus.chen@healingways.com', role: 'Medical Logistics Manager' },
];

// Helper to sanitize Firestore documents
function formatDoc<T>(docSnap: any): T {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at || new Date().toISOString(),
    updated_at: data.updated_at?.toDate ? data.updated_at.toDate().toISOString() : data.updated_at || new Date().toISOString(),
  } as T;
}

// ----------------------------------------------------
// AUTHENTICATION METHODS & SESSION MANAGEMENT
// ----------------------------------------------------

export const ACTIVE_USER_STORAGE_KEY = 'hw_active_user';
export const REGISTERED_USERS_KEY = 'hw_registered_users_registry';

export function getLocalRegisteredUsers(): Record<string, UserProfile & { password?: string }> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalRegisteredUser(profile: UserProfile & { password?: string }): void {
  if (typeof window === 'undefined') return;
  try {
    const reg = getLocalRegisteredUsers();
    reg[profile.email.toLowerCase()] = profile;
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(reg));
  } catch {}
}

export function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserProfile | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem('hw_user_email', user.email);
    } else {
      localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
      localStorage.removeItem('hw_user_email');
    }
  } catch (err) {
    console.warn('Could not update stored user:', err);
  }
}

export function getCurrentUserId(): string | null {
  if (auth.currentUser?.uid) return auth.currentUser.uid;
  return getStoredUser()?.uid || null;
}

export function getCurrentUserEmail(): string | null {
  if (auth.currentUser?.email) return auth.currentUser.email;
  return getStoredUser()?.email || null;
}

export async function getUserProfileByUid(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return formatDoc<UserProfile>(userDoc);
    }
  } catch (err) {
    console.warn('Error reading user profile by uid:', err);
  }
  return null;
}

export async function getUserProfileByEmail(email: string): Promise<UserProfile | null> {
  const clean = email.trim().toLowerCase();
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', clean), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return formatDoc<UserProfile>(snap.docs[0]);
    }
  } catch (err) {
    console.warn('Error reading user profile by email from Firestore:', err);
  }

  // Check local registry fallback
  const localReg = getLocalRegisteredUsers();
  if (localReg[clean]) {
    return localReg[clean];
  }

  return null;
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const user = auth.currentUser;
  if (user) {
    const profile = await getUserProfileByUid(user.uid);
    if (profile) return profile;
    return {
      uid: user.uid,
      email: user.email || '',
      fullName: user.displayName || user.email?.split('@')[0] || 'Patient',
      role: user.email?.toLowerCase().includes('admin') ? 'admin' : 'patient',
    };
  }

  // Check stored active user session
  const stored = getStoredUser();
  if (stored) {
    const refreshed = await getUserProfileByUid(stored.uid);
    if (refreshed) {
      setStoredUser(refreshed);
      return refreshed;
    }
    return stored;
  }

  return null;
}

export async function saveUserProfile(profile: Partial<UserProfile> & { uid: string; email: string }): Promise<void> {
  try {
    const userRef = doc(db, 'users', profile.uid);
    const now = new Date().toISOString();
    const cleanEmail = profile.email.trim().toLowerCase();
    const role = profile.role || (cleanEmail.includes('admin') ? 'admin' : 'patient');

    const dataToSave = {
      ...profile,
      email: cleanEmail,
      role,
      updatedAt: now,
      updated_at: now,
    };

    await setDoc(userRef, dataToSave, { merge: true });
    const currentStored = getStoredUser();
    if (currentStored?.uid === profile.uid) {
      setStoredUser({ ...currentStored, ...dataToSave } as UserProfile);
    }
  } catch (err) {
    console.error('Error saving user profile in Firestore:', err);
  }
}

export interface AuthResult {
  success: boolean;
  user?: UserProfile;
  error?: string;
  reason?: 'not_found' | 'wrong_password' | 'email_already_in_use' | 'general';
}

/**
 * Register a new user with email and password
 */
export async function registerUser(params: {
  email: string;
  password?: string;
  fullName: string;
  role?: 'patient' | 'admin' | 'coordinator';
  phone?: string;
}): Promise<AuthResult> {
  const cleanEmail = params.email.trim().toLowerCase();
  const role = params.role || (cleanEmail.includes('admin') ? 'admin' : 'patient');

  // 1. Check if user already exists in Firestore
  const existing = await getUserProfileByEmail(cleanEmail);
  if (existing) {
    return {
      success: false,
      reason: 'email_already_in_use',
      error: 'An account with this email address already exists. Please sign in.',
    };
  }

  // 2. Try creating in Firebase Auth if available
  let resolvedUid = '';
  if (params.password) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, params.password);
      resolvedUid = cred.user.uid;
      if (params.fullName) {
        await updateProfile(cred.user, { displayName: params.fullName });
      }
    } catch (authErr: any) {
      if (authErr?.code === 'auth/email-already-in-use') {
        return {
          success: false,
          reason: 'email_already_in_use',
          error: 'An account with this email address already exists. Please sign in.',
        };
      }
      // If operation-not-allowed or network, we generate deterministic Firestore UID
      console.warn('Firebase Auth creation notice:', authErr?.code);
    }
  }

  if (!resolvedUid) {
    resolvedUid = `user_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now().toString(36)}`;
  }

  const now = new Date().toISOString();
  const profile: UserProfile = {
    uid: resolvedUid,
    email: cleanEmail,
    fullName: params.fullName || 'Patient',
    role,
    phone: params.phone || '',
    createdAt: now,
    updatedAt: now,
  };

  // 3. Save profile and credentials in Firestore
  try {
    const userDocRef = doc(db, 'users', resolvedUid);
    await setDoc(userDocRef, {
      ...profile,
      password: params.password || '',
    }, { merge: true });
  } catch (err) {
    console.error('Error saving user in Firestore:', err);
  }

  // Also save to local registered users cache
  saveLocalRegisteredUser({
    ...profile,
    password: params.password || '',
  });

  // 4. Set stored session
  setStoredUser(profile);

  return { success: true, user: profile };
}

/**
 * Login user with email and password
 */
export async function loginUser(emailInput: string, passwordInput: string): Promise<AuthResult> {
  const cleanEmail = emailInput.trim().toLowerCase();

  // 1. First check if the account exists in Firestore
  const firestoreUserDoc = await getUserProfileByEmail(cleanEmail);

  // 2. Try Firebase Auth sign in
  let authSuccess = false;
  let authUid = '';
  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, passwordInput);
    if (cred.user) {
      authSuccess = true;
      authUid = cred.user.uid;
    }
  } catch (authErr: any) {
    if (authErr?.code === 'auth/wrong-password') {
      return {
        success: false,
        reason: 'wrong_password',
        error: 'Incorrect password. Please verify your credentials and try again.',
      };
    }
    // If auth/user-not-found or invalid-credential or operation-not-allowed, proceed to check Firestore
  }

  // 3. If account does NOT exist in Firestore AND didn't succeed in Auth, it's not found!
  if (!firestoreUserDoc && !authSuccess) {
    return {
      success: false,
      reason: 'not_found',
      error: 'No account found with this email address. Please sign up to create your account.',
    };
  }

  // 4. If found in Firestore, verify password if stored
  if (firestoreUserDoc) {
    const rawData = (firestoreUserDoc as any);
    if (rawData.password && rawData.password !== passwordInput && !authSuccess) {
      return {
        success: false,
        reason: 'wrong_password',
        error: 'Incorrect password. Please verify your credentials and try again.',
      };
    }

    setStoredUser(firestoreUserDoc);
    return { success: true, user: firestoreUserDoc };
  }

  // If Auth succeeded without Firestore doc, create profile
  if (authSuccess) {
    const profile: UserProfile = {
      uid: authUid,
      email: cleanEmail,
      fullName: cleanEmail.split('@')[0],
      role: cleanEmail.includes('admin') ? 'admin' : 'patient',
    };
    await saveUserProfile(profile);
    setStoredUser(profile);
    return { success: true, user: profile };
  }

  return {
    success: false,
    reason: 'not_found',
    error: 'No account found with this email address. Please sign up to create your account.',
  };
}

/**
 * Log out user from both Firebase Auth and stored local session
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Sign out notice:', err);
  }
  setStoredUser(null);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('hw_consultation_case_id');
  }
}

// ----------------------------------------------------
// CASE MANAGEMENT (PATIENT & ADMIN)
// ----------------------------------------------------

/**
 * Creates or initializes a new patient case in Firestore
 */
export async function createPatientCase(caseData: Partial<PatientCase> & { user_id?: string }): Promise<PatientCase> {
  const caseNumber = caseData.case_number || `HW-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();
  const userId = caseData.user_id || auth.currentUser?.uid || `guest_${Date.now()}`;

  const fullCase: PatientCase = {
    id: caseData.id || `case_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    case_number: caseNumber,
    patient_name: caseData.patient_name || 'Patient',
    patient_email: caseData.patient_email || '',
    patient_phone: caseData.patient_phone || '',
    age: caseData.age || '',
    gender: caseData.gender || '',
    country: caseData.country || '',
    state: caseData.state || '',
    need: caseData.need || caseData.healthcare_area || 'General Medical Consultation',
    support_type: caseData.support_type || caseData.need || '',
    healthcare_area: caseData.healthcare_area || '',
    situation: caseData.situation || '',
    situation_description: caseData.situation_description || caseData.situation || '',
    has_diagnosis: caseData.has_diagnosis || 'Yes',
    diagnosis: caseData.diagnosis || '',
    treatment_status: caseData.treatment_status || '',
    care_outside_country: caseData.care_outside_country || 'Yes',
    preferred_destination: caseData.preferred_destination || '',
    preferred_location: caseData.preferred_location || caseData.preferred_destination || '',
    time_frame: caseData.time_frame || 'Within 1-3 months',
    budget: caseData.budget || '$5,000 - $10,000',
    companions: caseData.companions || 'None',
    special_assistance: caseData.special_assistance || 'None',
    notes: caseData.notes || '',
    stage: caseData.stage || 'Consultation Submitted',
    workflow_stage: caseData.workflow_stage || 'Consultation Submitted',
    status: caseData.status || 'New',
    priority: caseData.priority || 'Normal',
    coordinator_id: caseData.coordinator_id || 'coord-1',
    coordinator_name: caseData.coordinator_name || 'Sarah James',
    review_text: caseData.review_text ?? null,
    review_accepted: caseData.review_accepted ?? false,
    review_accepted_at: caseData.review_accepted_at ?? null,
    selected_hospital_id: caseData.selected_hospital_id ?? null,
    selected_hospital: caseData.selected_hospital ?? null,
    recommended_hospitals: caseData.recommended_hospitals || DEFAULT_HOSPITALS.slice(0, 2),
    itinerary_notes: caseData.itinerary_notes ?? null,
    itinerary_confirmed_by_patient: caseData.itinerary_confirmed_by_patient ?? false,
    accommodation_details: caseData.accommodation_details ?? null,
    visa_details: caseData.visa_details ?? null,
    accommodation_visa_confirmed_by_patient: caseData.accommodation_visa_confirmed_by_patient ?? false,
    flight_details: caseData.flight_details ?? null,
    confirmed_by_patient: caseData.confirmed_by_patient ?? false,
    created_at: caseData.created_at || now,
    updated_at: now,
    documents: caseData.documents || [],
    treatment_updates: caseData.treatment_updates || [],
    consultation_for: caseData.consultation_for || 'Myself',
    contact_name: caseData.contact_name || caseData.patient_name || '',
    user_id: userId,
  };

  try {
    const caseRef = doc(db, 'cases', fullCase.id);
    await setDoc(caseRef, fullCase, { merge: true });
  } catch (err) {
    console.error('Error saving case to Firestore:', err);
  }

  // Also save to localStorage as backup
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('hw_active_case', JSON.stringify(fullCase));
      localStorage.setItem('hw_active_case_id', fullCase.id);
    } catch {}
  }

  return fullCase;
}

/**
 * Updates any specific fields of an existing patient case
 */
export async function updatePatientCase(caseId: string, updates: Partial<PatientCase>): Promise<void> {
  const now = new Date().toISOString();
  try {
    const caseRef = doc(db, 'cases', caseId);
    await setDoc(caseRef, { ...updates, updated_at: now }, { merge: true });
  } catch (err) {
    console.error('Error updating patient case in Firestore:', err);
  }

  // Also update localStorage backup
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('hw_active_case');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.id === caseId) {
          localStorage.setItem('hw_active_case', JSON.stringify({ ...parsed, ...updates, updated_at: now }));
        }
      }
    } catch {}
  }
}

/**
 * Retrieves a single case by its ID
 */
export async function getCaseById(caseId: string): Promise<PatientCase | null> {
  try {
    const caseRef = doc(db, 'cases', caseId);
    const snap = await getDoc(caseRef);
    if (snap.exists()) {
      return formatDoc<PatientCase>(snap);
    }
  } catch (err) {
    console.error('Error fetching case by ID:', err);
  }
  return null;
}

/**
 * Retrieves the active case for a logged in user by UID or email
 */
export async function getUserActiveCase(userId?: string | null, userEmail?: string | null): Promise<PatientCase | null> {
  const effectiveUid = userId || getCurrentUserId();
  const effectiveEmail = userEmail || getCurrentUserEmail();

  try {
    const casesRef = collection(db, 'cases');

    if (effectiveUid) {
      try {
        const q = query(casesRef, where('user_id', '==', effectiveUid), orderBy('created_at', 'desc'), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return formatDoc<PatientCase>(snapshot.docs[0]);
        }
      } catch {
        const qFallback = query(casesRef, where('user_id', '==', effectiveUid));
        const snapshot = await getDocs(qFallback);
        if (!snapshot.empty) {
          return formatDoc<PatientCase>(snapshot.docs[0]);
        }
      }
    }

    if (effectiveEmail) {
      const qEmail = query(casesRef, where('patient_email', '==', effectiveEmail), limit(1));
      const snapshot = await getDocs(qEmail);
      if (!snapshot.empty) {
        const found = formatDoc<PatientCase>(snapshot.docs[0]);
        if (effectiveUid && found.user_id !== effectiveUid) {
          try {
            await updateDoc(doc(db, 'cases', found.id), { user_id: effectiveUid });
          } catch {}
        }
        return found;
      }
    }
  } catch (err) {
    console.error('Error fetching active case:', err);
  }

  // Check local active case backup if matching user
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('hw_active_case');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          (effectiveUid && parsed.user_id === effectiveUid) ||
          (effectiveEmail && parsed.patient_email?.toLowerCase() === effectiveEmail.toLowerCase())
        ) {
          return parsed as PatientCase;
        }
      }
    } catch {}
  }

  return null;
}

/**
 * Retrieves all cases for the admin dashboard
 */
export async function getAllCasesForAdmin(): Promise<PatientCase[]> {
  try {
    const casesRef = collection(db, 'cases');
    const snapshot = await getDocs(casesRef);
    const cases: PatientCase[] = [];
    snapshot.forEach((d) => {
      cases.push(formatDoc<PatientCase>(d));
    });
    // Sort descending by created_at
    return cases.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (err) {
    console.error('Error fetching admin cases from Firestore:', err);
    return [];
  }
}

/**
 * Initial cases seeder - disabled per user specification to prevent demo entries
 */
export async function ensureInitialCasesSeeded(): Promise<void> {
  // Demo cases are explicitly removed per requirements
  return;
}

// ----------------------------------------------------
// SEQUENTIAL STAGE ACTIONS & CONFIRMATIONS
// ----------------------------------------------------

/**
 * Admin publishes or updates the clinical case review
 */
export async function adminSubmitCaseReview(caseId: string, reviewText: string): Promise<void> {
  await updatePatientCase(caseId, {
    review_text: reviewText,
    review_accepted: false,
    review_accepted_at: null,
    workflow_stage: 'Case Review',
    stage: 'Case Review',
    status: 'In Progress',
  });
}

/**
 * Patient confirms and accepts the Case Review to unlock Hospital Recommendation
 */
export async function patientAcceptCaseReview(caseId: string): Promise<void> {
  await updatePatientCase(caseId, {
    review_accepted: true,
    review_accepted_at: new Date().toISOString(),
    workflow_stage: 'Hospital Recommendation',
    stage: 'Hospital Recommendation',
  });
}

/**
 * Admin updates hospital recommendations for a case
 */
export async function adminSetRecommendedHospitals(caseId: string, hospitals: Hospital[]): Promise<void> {
  await updatePatientCase(caseId, {
    recommended_hospitals: hospitals,
  });
}

/**
 * Patient selects a recommended hospital to unlock Medical Itinerary
 */
export async function patientSelectHospital(caseId: string, hospitalId: string, hospitalObj?: Hospital): Promise<void> {
  await updatePatientCase(caseId, {
    selected_hospital_id: hospitalId,
    selected_hospital: hospitalObj || null,
    workflow_stage: 'Medical Itinerary',
    stage: 'Medical Itinerary',
  });
}

/**
 * Admin sets or updates the Medical Itinerary schedule
 */
export async function adminSetMedicalItinerary(caseId: string, itineraryNotes: string): Promise<void> {
  await updatePatientCase(caseId, {
    itinerary_notes: itineraryNotes,
    itinerary_confirmed_by_patient: false,
  });
}

/**
 * Patient confirms the Medical Itinerary to unlock Accommodation & Visa
 */
export async function patientConfirmMedicalItinerary(caseId: string): Promise<void> {
  await updatePatientCase(caseId, {
    itinerary_confirmed_by_patient: true,
    workflow_stage: 'Accommodation & Visa',
    stage: 'Accommodation & Visa',
  });
}

/**
 * Admin sets Accommodation & Visa arrangements
 */
export async function adminSetAccommodationAndVisa(caseId: string, accommodationDetails: string, visaDetails: string): Promise<void> {
  await updatePatientCase(caseId, {
    accommodation_details: accommodationDetails,
    visa_details: visaDetails,
    accommodation_visa_confirmed_by_patient: false,
  });
}

/**
 * Patient confirms Accommodation & Visa to unlock Travel Preparation
 */
export async function patientConfirmAccommodationAndVisa(caseId: string): Promise<void> {
  await updatePatientCase(caseId, {
    accommodation_visa_confirmed_by_patient: true,
    workflow_stage: 'Travel Preparation',
    stage: 'Travel Preparation',
  });
}

/**
 * Admin sets Travel / Flight preparation details
 */
export async function adminSetTravelDetails(caseId: string, flightDetails: string): Promise<void> {
  await updatePatientCase(caseId, {
    flight_details: flightDetails,
    confirmed_by_patient: false,
  });
}

/**
 * Patient confirms Travel Details to unlock Treatment & Recovery
 */
export async function patientConfirmTravel(caseId: string): Promise<void> {
  await updatePatientCase(caseId, {
    confirmed_by_patient: true,
    workflow_stage: 'Treatment & Recovery',
    stage: 'Treatment & Recovery',
    status: 'Scheduled',
  });
}

/**
 * Adds a new clinical/recovery update for a patient during Treatment & Recovery
 */
export async function addTreatmentUpdate(caseId: string, update: Omit<TreatmentUpdate, 'id' | 'caseId' | 'createdAt'>): Promise<TreatmentUpdate> {
  const updateId = `upd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const fullUpdate: TreatmentUpdate = {
    id: updateId,
    caseId,
    title: update.title,
    notes: update.notes,
    date: update.date || new Date().toLocaleDateString('en-GB'),
    authorName: update.authorName || 'Care Coordinator',
    authorRole: update.authorRole || 'Clinical Lead',
    createdAt: now,
  };

  // Add to Firestore collection
  try {
    const updRef = doc(db, 'treatment_updates', updateId);
    await setDoc(updRef, fullUpdate);
  } catch (err) {
    console.error('Error saving treatment update document:', err);
  }

  // Also append into case record's array
  try {
    const currentCase = await getCaseById(caseId);
    if (currentCase) {
      const existing = currentCase.treatment_updates || [];
      await updatePatientCase(caseId, {
        treatment_updates: [fullUpdate, ...existing],
      });
    }
  } catch (err) {
    console.error('Error updating case treatment updates array:', err);
  }

  return fullUpdate;
}

/**
 * Fetches all treatment updates for a specific case
 */
export async function getTreatmentUpdatesForCase(caseId: string): Promise<TreatmentUpdate[]> {
  try {
    const updatesRef = collection(db, 'treatment_updates');
    const q = query(updatesRef, where('caseId', '==', caseId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => formatDoc<TreatmentUpdate>(d));
    }
  } catch (err) {
    // Fallback: load from case document directly
    const caseDoc = await getCaseById(caseId);
    if (caseDoc && caseDoc.treatment_updates) {
      return caseDoc.treatment_updates;
    }
  }
  return [];
}

/**
 * Registers an uploaded document in Firestore
 */
export async function saveCaseDocument(docData: Omit<CaseDocument, 'id' | 'createdAt'>): Promise<CaseDocument> {
  const docId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const fullDoc: CaseDocument = {
    id: docId,
    caseId: docData.caseId,
    userId: docData.userId,
    name: docData.name,
    fileSize: docData.fileSize,
    fileType: docData.fileType,
    fileUrl: docData.fileUrl || '',
    category: docData.category || 'Medical Record',
    createdAt: now,
  };

  try {
    const docRef = doc(db, 'documents', docId);
    await setDoc(docRef, fullDoc);
  } catch (err) {
    console.error('Error saving document to Firestore:', err);
  }

  // Also append to case document record
  try {
    const currentCase = await getCaseById(docData.caseId);
    if (currentCase) {
      const existing = currentCase.documents || [];
      await updatePatientCase(docData.caseId, {
        documents: [fullDoc, ...existing],
      });
    }
  } catch (err) {
    console.error('Error updating case documents array:', err);
  }

  return fullDoc;
}
