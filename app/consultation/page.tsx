'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import StepOneAboutYou from './_components/stepOne';
import StepTwoYourSituation from './_components/stepTwo';
import StepThreeMedicalDetails from './_components/stepThree';
import StepFourDocuments from './_components/stepFour';
import StepFivePreferences from './_components/stepFive';
import StepSixConsent, { ReviewData } from './_components/stepSix';
import StepSevenSuccess from './_components/stepSevenSuccess';

interface ConsultationFormState {
  aboutYou?: {
    consultationFor?: string;
    fullName?: string;
    patientName?: string;
    email?: string;
    phone?: string;
    country?: string;
    password?: string;
    userId?: string;
  };
  situation?: {
    supportType?: string;
    healthcareArea?: string;
    situationDescription?: string;
  };
  medicalDetails?: {
    hasDiagnosis?: string;
    diagnosis?: string;
    treatmentStatus?: string;
  };
  documentsUploaded?: Array<{ name: string; path: string; size: number }>;
  preferences?: {
    careOutsideCountry?: string;
    preferredLocation?: string;
    priorities?: string[];
  };
}

const STORAGE_KEY = 'hw_consultation_form_data';
const STEP_KEY = 'hw_consultation_current_step';
const CASE_KEY = 'hw_consultation_case_id';

export default function ConsultationPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ConsultationFormState>({});
  const [caseId, setCaseId] = useState<string | undefined>(undefined);
  const [submittedCaseId, setSubmittedCaseId] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore saved progress on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      const savedStep = localStorage.getItem(STEP_KEY);
      const savedCaseId = localStorage.getItem(CASE_KEY);

      if (savedData) {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      }
      if (savedStep) {
        const stepNum = parseInt(savedStep, 10);
        if (stepNum >= 1 && stepNum <= 7) {
          setCurrentStep(stepNum);
        }
      }
      if (savedCaseId) {
        setCaseId(savedCaseId);
      }
    } catch (e) {
      console.warn('Could not restore consultation state from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save progress changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      localStorage.setItem(STEP_KEY, currentStep.toString());
      if (caseId) {
        localStorage.setItem(CASE_KEY, caseId);
      }
    } catch (e) {
      console.warn('Could not persist consultation state', e);
    }
  }, [formData, currentStep, caseId, isLoaded]);

  const goBack = () => {
    setCurrentStep((step) => {
      const newStep = Math.max(1, step - 1);
      localStorage.setItem(STEP_KEY, newStep.toString());
      return newStep;
    });
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    localStorage.setItem(STEP_KEY, step.toString());
  };

  const handleStepOneNext = (data: any) => {
    const updated = { ...formData, aboutYou: data };
    setFormData(updated);
    if (data?.email) {
      try {
        localStorage.setItem('hw_user_email', data.email);
        localStorage.setItem('hw_user_fullname', data.fullName || data.patientName || '');
      } catch {}
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setCurrentStep(2);
    localStorage.setItem(STEP_KEY, '2');
  };

  const handleStepTwoNext = (data: any) => {
    console.log('handleStepTwoNext called with data:', data);
    const updated = { ...formData, situation: data };
    setFormData(updated);
    if (data.caseId) {
      setCaseId(data.caseId);
      try {
        localStorage.setItem(CASE_KEY, data.caseId);
        localStorage.setItem('hw_active_case_id', data.caseId);
      } catch {}
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setCurrentStep(3);
    localStorage.setItem(STEP_KEY, '3');
  };

  const handleStepThreeNext = (data: any) => {
    const updated = { ...formData, medicalDetails: data };
    setFormData(updated);
    if (data.caseId) {
      setCaseId(data.caseId);
      try {
        localStorage.setItem(CASE_KEY, data.caseId);
        localStorage.setItem('hw_active_case_id', data.caseId);
      } catch {}
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setCurrentStep(4);
    localStorage.setItem(STEP_KEY, '4');
  };

  const handleStepFourNext = (data: any) => {
    const updated = { ...formData, documentsUploaded: data.documentsUploaded || [] };
    setFormData(updated);
    if (data.caseId) {
      setCaseId(data.caseId);
      try {
        localStorage.setItem(CASE_KEY, data.caseId);
        localStorage.setItem('hw_active_case_id', data.caseId);
      } catch {}
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setCurrentStep(5);
    localStorage.setItem(STEP_KEY, '5');
  };

  const handleStepFiveNext = (data: any) => {
    const updated = { ...formData, preferences: data };
    setFormData(updated);
    if (data.caseId) {
      setCaseId(data.caseId);
      try {
        localStorage.setItem(CASE_KEY, data.caseId);
        localStorage.setItem('hw_active_case_id', data.caseId);
      } catch {}
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setCurrentStep(6);
    localStorage.setItem(STEP_KEY, '6');
  };

  const handleStepSixSubmit = (consentData?: any) => {
    const finalCaseId = consentData?.caseId || caseId || (typeof window !== 'undefined' ? (localStorage.getItem(CASE_KEY) || localStorage.getItem('hw_active_case_id')) : '') || '';
    setSubmittedCaseId(finalCaseId);
    if (finalCaseId) {
      try {
        localStorage.setItem(CASE_KEY, finalCaseId);
        localStorage.setItem('hw_active_case_id', finalCaseId);
        localStorage.setItem('hw_consultation_completed', 'true');
        localStorage.setItem('hw_consultation_completed_case_id', finalCaseId);
        if (formData.aboutYou?.email) {
          localStorage.setItem('hw_user_email', formData.aboutYou.email);
        }
        if (formData.aboutYou?.fullName || formData.aboutYou?.patientName) {
          localStorage.setItem('hw_user_fullname', formData.aboutYou.fullName || formData.aboutYou.patientName || '');
        }
      } catch {}
    }
    setCurrentStep(7);
    localStorage.setItem(STEP_KEY, '7');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  if (currentStep === 7) {
    const resolvedName = formData.aboutYou?.fullName || (typeof window !== 'undefined' ? localStorage.getItem('hw_user_fullname') || '' : '');
    const resolvedEmail = formData.aboutYou?.email || (typeof window !== 'undefined' ? localStorage.getItem('hw_user_email') || '' : '');
    return (
      <StepSevenSuccess
        userName={resolvedName}
        userEmail={resolvedEmail}
        caseId={submittedCaseId || caseId}
        onGoHome={() => router.push('/')}
      />
    );
  }

  const reviewData: ReviewData = {
    aboutYou: {
      consultationFor: formData.aboutYou?.consultationFor || 'Myself',
      fullName: formData.aboutYou?.fullName,
      email: formData.aboutYou?.email,
      phone: formData.aboutYou?.phone,
      country: formData.aboutYou?.country,
    },
    situation: {
      supportType: formData.situation?.supportType,
      healthcareArea: formData.situation?.healthcareArea,
      description: formData.situation?.situationDescription,
    },
    medicalDetails: {
      diagnosed: formData.medicalDetails?.diagnosis || formData.medicalDetails?.hasDiagnosis,
      treatmentStatus: formData.medicalDetails?.treatmentStatus,
    },
    documents: {
      fileCount: formData.documentsUploaded?.length || 0,
    },
    preferences: {
      careAbroad: formData.preferences?.careOutsideCountry,
      preferredLocation: formData.preferences?.preferredLocation,
      whatMatters: formData.preferences?.priorities,
    },
  };

  switch (currentStep) {
    case 1:
      return <StepOneAboutYou onNext={handleStepOneNext} initialData={formData.aboutYou} />;

    case 2:
      return (
        <StepTwoYourSituation
          onNext={handleStepTwoNext}
          onBack={goBack}
          initialData={formData.situation}
          aboutYou={formData.aboutYou}
          caseId={caseId}
        />
      );

    case 3:
      return (
        <StepThreeMedicalDetails
          onNext={handleStepThreeNext}
          onBack={goBack}
          initialData={formData.medicalDetails}
          caseId={caseId}
        />
      );

    case 4:
      return <StepFourDocuments onNext={handleStepFourNext} onBack={goBack} caseId={caseId} />;

    case 5:
      return (
        <StepFivePreferences
          onNext={handleStepFiveNext}
          onBack={goBack}
          initialData={formData.preferences}
          caseId={caseId}
        />
      );

    case 6:
      return (
        <StepSixConsent
          reviewData={reviewData}
          caseId={caseId}
          onEditStep={goToStep}
          onBack={goBack}
          onSubmit={handleStepSixSubmit}
        />
      );

    default:
      return null;
  }
}