'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react'
import { useLoginMutation } from '@/lib/redux/features/auth/authApi'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  
  // Use RTK Query auto-generated hook
  const [login, { isLoading, error }] = useLoginMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await login({ email, password }).unwrap()
      if (response.success) {
        // Redux slice addMatcher handles setting the cookies!
        // Decode token to determine the user's role and steer them
        const token = response.data.accessToken
        const payloadBase64 = token.split('.')[1]
        if (payloadBase64) {
          const decodedPayload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
          const payload = JSON.parse(decodedPayload)
          const role = payload.role
          console.log(role,"==============================")
          
          if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
            router.push('/admin')
          } else {
            router.push('/user')
          }
        } else {
          router.push('/') // Fallback to let middleware handle it
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Login failed:', err)
    }
  }

  // Helper to extract error message safely
  const getErrorMessage = () => {
    if (!error) return null
    if ('data' in error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (error.data as any)?.message || 'Login failed'
    }
    return 'An unexpected error occurred'
  }

  const errorMessage = getErrorMessage()

  return (
    <div className="min-h-screen bg-[var(--ib-bg)] flex flex-col justify-center items-center p-4 selection:bg-[var(--ib-accbg)] relative overflow-hidden">
      
      {/* Subtle background atmosphere */}
      <style jsx>{`
        @keyframes horizontal {
          0%, 100% { transform: translateX(-10%) translateY(0); }
          50% { transform: translateX(110%) translateY(0); }
        }
        @keyframes vertical {
          0%, 100% { transform: translateY(-10%) translateX(0); }
          50% { transform: translateY(110%) translateX(0); }
        }
        @keyframes diagonal-1 {
          0%, 100% { transform: translate(-10%, -10%); }
          50% { transform: translate(110%, 110%); }
        }
        @keyframes diagonal-2 {
          0%, 100% { transform: translate(110%, -10%); }
          50% { transform: translate(-10%, 110%); }
        }
        @keyframes random-path {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(50vw, 20vh); }
          50% { transform: translate(20vw, 80vh); }
          75% { transform: translate(-30vw, 40vh); }
        }
        .animate-horizontal { animation: horizontal 20s linear infinite; }
        .animate-vertical { animation: vertical 25s linear infinite; }
        .animate-diagonal-1 { animation: diagonal-1 30s linear infinite; }
        .animate-diagonal-2 { animation: diagonal-2 22s linear infinite; }
        .animate-random-path { animation: random-path 40s ease-in-out infinite; }
      `}</style>

      <div 
        className="absolute w-[40%] h-[40%] bg-[var(--ib-acc)]/10 rounded-full blur-[100px] animate-horizontal" 
        style={{ top: '15%', left: '-20%', animationDelay: '-5s' }} 
      />
      <div 
        className="absolute w-[35%] h-[35%] bg-[var(--ib-acc)]/8 rounded-full blur-[100px] animate-vertical" 
        style={{ top: '-25%', left: '45%', animationDelay: '-12s' }} 
      />
      <div 
        className="absolute w-[45%] h-[45%] bg-[var(--ib-accbg)] rounded-full blur-[120px] animate-diagonal-1" 
        style={{ top: '-15%', left: '-15%', animationDelay: '-8s' }} 
      />
      <div 
        className="absolute w-[40%] h-[40%] bg-[var(--ib-acc)]/5 rounded-full blur-[120px] animate-diagonal-2" 
        style={{ top: '-15%', right: '-15%', animationDelay: '-20s' }} 
      />

      <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Form card */}
        <div className="bg-[var(--ib-card)] rounded-2xl shadow-[0_20px_50px_rgba(11,18,32,0.06)] sm:p-12 p-8 border border-[var(--ib-line)] relative z-10 overflow-hidden">
          
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--ib-acc)]/30 to-transparent" />

          <div className="relative z-10">
            <div className="mb-10 text-center">
              <div className="mb-6 inline-flex items-center justify-center overflow-hidden rounded-2xl shadow-[0_8px_24px_-12px_color-mix(in_srgb,var(--ib-acc)_45%,transparent)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand-mark.png"
                  alt="ISOBrain.AI"
                  width={64}
                  height={64}
                  className="size-16 object-cover"
                />
              </div>
              <p className="mb-2 text-[13px] font-bold tracking-[-0.02em] text-[var(--ib-ink)]">
                ISOBrain<span className="text-[var(--ib-acc)]">.AI</span>
              </p>
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-[var(--ib-ink)]">
                Welcome Back
              </h1>
              <p className="text-sm font-medium text-[var(--ib-mute)]">
                Please enter your details to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-semibold">{errorMessage}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[14px] font-bold text-[var(--ib-mute)] ml-1" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--ib-mute)] group-focus-within:text-[var(--ib-acc)] transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 mt-2 bg-[var(--ib-bg)] border border-[var(--ib-line)] rounded-[10px] text-sm font-medium text-[var(--ib-ink)] focus:bg-[var(--ib-card)] outline-none ring-offset-0 focus:ring-4 focus:ring-[var(--ib-acc)]/10 focus:border-[var(--ib-acc)] transition-all placeholder:text-[var(--ib-mute)]"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[14px] font-bold text-[var(--ib-mute)]" htmlFor="password">Password</label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--ib-mute)] group-focus-within:text-[var(--ib-acc)] transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-4 bg-[var(--ib-bg)] border border-[var(--ib-line)] rounded-[10px] text-sm font-medium text-[var(--ib-ink)] focus:bg-[var(--ib-card)] outline-none ring-offset-0 focus:ring-4 focus:ring-[var(--ib-acc)]/10 focus:border-[var(--ib-acc)] transition-all placeholder:text-[var(--ib-mute)]"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--ib-mute)] hover:text-[var(--ib-ink)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-[10px] text-white bg-[var(--ib-acc)] transition-all hover:translate-y-[-2px] hover:opacity-95 hover:shadow-lg hover:shadow-[var(--ib-acc)]/20 active:translate-y-[0px] disabled:opacity-70 disabled:cursor-not-allowed mt-4 overflow-hidden"
              >
                <div className="relative flex items-center gap-2">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Sign in to Dashboard
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm font-medium text-[var(--ib-mute)]">
                Don&apos;t have an account?{' '}
                <a 
                  href="https://www.isobrain.ai/auth/sign-up"
                  target='_blank' 
                  className="text-[var(--ib-acc)] font-bold hover:underline underline-offset-4"
                >
                  Sign up free
                </a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer Link */}
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
           <p className="text-xs font-bold text-[var(--ib-mute)] uppercase tracking-widest">© 2026 ISO BRAIN AI • PREMIER ACCESS</p>
        </div>
      </div>
    </div>
  )
}
