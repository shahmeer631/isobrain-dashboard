export interface OnboardingProfile {
  firstName: string | null;
  lastName: string | null;
  email: string;
  industry: string | null;
  professionalRole: string | null;
  professionalRoleOther: string | null;
  targetStandardIds: string[];
}

export interface OnboardingState {
  needsOnboarding: boolean;
  onboardingCompleted: boolean | null;
  onboardingStep: number;
  onboardingCompletedAt: string | null;
  totalSteps: number;
  profile: OnboardingProfile;
  options: {
    industries: string[];
    professionalRoles: string[];
  };
}

export interface OnboardingResponse {
  success: boolean;
  message: string;
  data: OnboardingState;
}

export interface SaveOnboardingPayload {
  firstName?: string;
  lastName?: string;
  industry?: string;
  professionalRole?: string;
  professionalRoleOther?: string;
  targetStandardIds?: string[];
  onboardingStep?: number;
}

export interface CompleteOnboardingPayload {
  firstName: string;
  lastName: string;
  industry: string;
  professionalRole: string;
  professionalRoleOther?: string;
  targetStandardIds: string[];
}
