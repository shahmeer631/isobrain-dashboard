export interface LoginRequest {
  email: string
  password: string
}

export interface UserData {
  id?: string
  email: string
  role?: string
  iat?: number
  exp?: number
}

export interface AuthSuccessData {
  accessToken: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: AuthSuccessData
}
