export interface RationCard {
  id: string;
  familyName: string;
  mobileNumber: string;
  address: string;
  members: FamilyMember[];
}

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  relation: string;
  isVerified: boolean;
  verificationStatus: 'verified' | 'pending' | 'not_verified';
  governmentId?: string;
  governmentIdType?: 'aadhaar' | 'pan' | 'voter_id' | 'driving_license';
}

export interface OTPRequest {
  rationCardId: string;
  mobileNumber: string;
}

export interface OTPVerification {
  otp: string;
  rationCardId: string;
  mobileNumber: string;
}

export interface IDVerification {
  memberId: string;
  governmentIdType: 'aadhaar' | 'pan' | 'voter_id' | 'driving_license';
  governmentIdNumber: string;
  qrCodeData?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    rationCardId: string;
    familyName: string;
    selectedMember: FamilyMember | null;
  } | null;
  verificationStep: 'ration_id' | 'otp' | 'family_selection' | 'id_verification' | 'completed';
}
