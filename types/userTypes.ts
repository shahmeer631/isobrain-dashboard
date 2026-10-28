export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string | null
  bio: string | null
  preferredLanguage: string
  timezone: string
  courseUpdates: boolean
  marketingEmails: boolean
  weeklyProgressReport: boolean
  isEmailVerified: boolean
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER'
  status: string
  profileImage: string | null
  currentPlan: string
  subscribed: string
  createdAt: string
  updatedAt: string
  industry?: string | null
  professionalRole?: string | null
  targetStandardIds?: string[]
  onboardingCompleted?: boolean | null
  onboardingStep?: number | null
  onboardingCompletedAt?: string | null
  needsOnboarding?: boolean
}

export interface UserProfileResponse {
  success: boolean
  message: string
  data: UserProfile
}
