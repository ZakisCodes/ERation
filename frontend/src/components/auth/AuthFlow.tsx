'use client';

import React, { useState } from 'react';
import RationIdRegistration from './RationIdRegistration';
import OTPVerification from './OTPVerification';
import FamilyMemberSelection from './FamilyMemberSelection';
import GovernmentIdVerification from './GovernmentIdVerification';
import { FamilyMember } from '@/types/auth';

type AuthStep = 'ration_id' | 'otp' | 'family_selection' | 'id_verification' | 'completed';

interface AuthFlowProps {
  onAuthComplete: (user: any) => void;
}

export default function AuthFlow({ onAuthComplete }: AuthFlowProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>('ration_id');
  const [rationCardId, setRationCardId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const handleOTPSent = (cardId: string, mobile: string) => {
    setRationCardId(cardId);
    setMobileNumber(mobile);
    setCurrentStep('otp');
  };

  const handleOTPVerified = (token: string) => {
    localStorage.setItem('auth_token', token);
    setCurrentStep('family_selection');
  };

  const handleMemberSelected = (member: FamilyMember) => {
    setSelectedMember(member);
    setCurrentStep('id_verification');
  };

  const handleVerificationComplete = () => {
    const user = {
      rationCardId,
      mobileNumber,
      selectedMember,
    };
    onAuthComplete(user);
    setCurrentStep('completed');
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'otp':
        setCurrentStep('ration_id');
        break;
      case 'family_selection':
        setCurrentStep('otp');
        break;
      case 'id_verification':
        setCurrentStep('family_selection');
        break;
      default:
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'ration_id':
        return <RationIdRegistration onOTPSent={handleOTPSent} />;
      
      case 'otp':
        return (
          <OTPVerification
            rationCardId={rationCardId}
            mobileNumber={mobileNumber}
            onOTPVerified={handleOTPVerified}
            onBack={handleBack}
          />
        );
      
      case 'family_selection':
        return (
          <FamilyMemberSelection
            rationCardId={rationCardId}
            onMemberSelected={handleMemberSelected}
            onBack={handleBack}
          />
        );
      
      case 'id_verification':
        return selectedMember ? (
          <GovernmentIdVerification
            member={selectedMember}
            onVerificationComplete={handleVerificationComplete}
            onBack={handleBack}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return <>{renderCurrentStep()}</>;
}
