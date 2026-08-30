import { createClient } from '../utils/supabase/server';

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
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cases')
    .select(`
      id,
      created_at,
      support_type,
      diagnosis,
      situation_description,
      status,
      profiles (
        full_name,
        email,
        phone,
        country
      )
    `)
    .eq('id', caseId)
    .single();

  if (error) {
    console.error('Error fetching patient case details:', error.message);
    return null;
  }

  return data as PatientCaseDetails;
}