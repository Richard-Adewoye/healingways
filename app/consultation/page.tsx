'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Adjust these import paths to wherever your step components actually
// live. Based on how the existing codebase imports StepSevenSuccess
// (`./_components/stepSevenSuccess`), this assumes all step files sit in
// a sibling `_components` folder next to this page.tsx.
import StepOneAboutYou from './_components/stepOne';
import StepTwoYourSituation from './_components/stepTwo';
import StepThreeMedicalDetails from './_components/stepThree';
import StepFourDocuments from './_components/stepFour';
import StepFivePreferences from './_components/stepFive';
import StepSixConsent, { ReviewData } from './_components/stepSix';
import StepSevenSuccess from './_components/stepSevenSuccess';

// Everything collected across steps 1-5. Each step only writes its own
// slice — nothing here is a database concern, it's just what's needed to
// render Step 6's review screen and pass a name into the success screen.
interface ConsultationFormState {
  aboutYou?: {
    consultationFor?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    country?: string;
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

export default function ConsultationPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ConsultationFormState>({});

  // Set once Step 2 creates the `cases` row; every later step needs it to
  // know which case to update.
  const [caseId, setCaseId] = useState<string | undefined>(undefined);
  const [submittedCaseId, setSubmittedCaseId] = useState<string>('');

  const goBack = () => setCurrentStep((step) => Math.max(1, step - 1));
  const goToStep = (step: number) => setCurrentStep(step);

  const handleStepOneNext = (data: any) => {
    setFormData((prev) => ({ ...prev, aboutYou: data }));
    setCurrentStep(2);
  };

  const handleStepTwoNext = (data: any) => {
    setFormData((prev) => ({ ...prev, situation: data }));
    if (data.caseId) setCaseId(data.caseId);
    setCurrentStep(3);
  };

  const handleStepThreeNext = (data: any) => {
    setFormData((prev) => ({ ...prev, medicalDetails: data }));
    setCurrentStep(4);
  };

  const handleStepFourNext = (data: any) => {
    setFormData((prev) => ({ ...prev, documentsUploaded: data.documentsUploaded || [] }));
    setCurrentStep(5);
  };

  const handleStepFiveNext = (data: any) => {
    setFormData((prev) => ({ ...prev, preferences: data }));
    setCurrentStep(6);
  };

  const handleStepSixSubmit = () => {
    setSubmittedCaseId(caseId || '');
    setCurrentStep(7);
  };

  if (currentStep === 7) {
    return (
      <StepSevenSuccess
        userName={formData.aboutYou?.fullName}
        caseId={submittedCaseId}
        onGoHome={() => router.push('/')}
      />
    );
  }

  // Built fresh on every render from whatever's been collected so far —
  // Step 6 only reads it once the user reaches that step, by which point
  // every earlier field will be populated.
  const reviewData: ReviewData = {
    aboutYou: {
      consultationFor: formData.aboutYou?.consultationFor,
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