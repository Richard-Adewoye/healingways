import { getCaseById, PatientCase } from './firebase/services';

export interface PatientCaseDetails {
  id: string;
  created_at: string;
  support_type: string;
  diagnosis: string;
  situation_description: string;
  status: string;
  profiles: {
    full_name: string;
    email: string;
    phone: string;
    country: string;
  }[];
}

export async function getPatientCaseById(caseId: string): Promise<PatientCaseDetails | null> {
  try {
    const c = await getCaseById(caseId);
    if (!c) return null;

    return {
      id: c.id,
      created_at: c.created_at,
      support_type: c.support_type || c.need,
      diagnosis: c.diagnosis || c.need,
      situation_description: c.situation_description || c.situation || '',
      status: c.status,
      profiles: [
        {
          full_name: c.patient_name,
          email: c.patient_email,
          phone: c.patient_phone || '',
          country: c.country || '',
        },
      ],
    };
  } catch (err) {
    console.error('Error fetching patient case details from Firebase:', err);
    return null;
  }
}
