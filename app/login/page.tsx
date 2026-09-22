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
    <div className="min-h-screen bg-[#f8f4ff] flex flex-col justify-center items-center p-4 selection:bg-purple-200 relative overflow-hidden">
      
      {/* Moveable Floating Background Shapes */}
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

      {/* Multiple Directional Gradient Shapes with Randomized Start */}
      <div 
        className="absolute w-[40%] h-[40%] bg-linear-to-r from-purple-500/30 to-blue-500/20 rounded-full blur-[100px] animate-horizontal" 
        style={{ top: '15%', left: '-20%', animationDelay: '-5s' }} 
      />
      <div 
        className="absolute w-[35%] h-[35%] bg-linear-to-b from-blue-400/30 to-indigo-500/20 rounded-full blur-[100px] animate-vertical px-10" 
        style={{ top: '-25%', left: '45%', animationDelay: '-12s' }} 
      />
      <div 
        className="absolute w-[45%] h-[45%] bg-linear-to-br from-indigo-500/20 via-purple-500/20 to-transparent rounded-full blur-[120px] animate-diagonal-1" 
        style={{ top: '-15%', left: '-15%', animationDelay: '-8s' }} 
      />
      <div 
        className="absolute w-[40%] h-[40%] bg-linear-to-bl from-blue-600/20 to-transparent rounded-full blur-[120px] animate-diagonal-2" 
        style={{ top: '-15%', right: '-15%', animationDelay: '-20s' }} 
      />
      <div 
        className="absolute w-[50%] h-[50%] bg-linear-to-tr from-purple-500/10 via-blue-400/20 to-transparent rounded-full blur-[150px] animate-random-path" 
        style={{ bottom: '-20%', left: '25%', animationDelay: '-3s' }} 
      />

      {/* Small Floating Details */}
      <div 
        className="absolute w-24 h-24 bg-purple-400/30 rounded-full blur-[140px] animate-horizontal" 
        style={{ top: '20%', left: '10%', animationDelay: '-2s' }} 
      />
      <div 
        className="absolute w-32 h-32 bg-blue-400/20 rounded-full blur-[50px] animate-vertical px-10" 
        style={{ bottom: '20%', right: '15%', animationDelay: '-15s' }} 
      />
      <div 
        className="absolute w-20 h-20 bg-indigo-500/30 rounded-full blur-[30px] animate-diagonal-1" 
        style={{ top: '60%', left: '40%', animationDelay: '-7s' }} 
      />
      <div 
        className="absolute w-28 h-28 bg-purple-500/20 rounded-full blur-[40px] animate-diagonal-2" 
        style={{ top: '10%', right: '30%', animationDelay: '-11s' }} 
      />
      <div 
        className="absolute w-16 h-16 bg-blue-300/40 rounded-full blur-[20px] animate-random-path" 
        style={{ bottom: '40%', left: '10%', animationDelay: '-19s' }} 
      />

      <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* High-Fidelity Blurry Glass Card */}
        <div className="bg-white/10 dark:bg-slate-900/10 backdrop-blur-3xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] sm:p-12 p-8 border border-white/20 dark:border-slate-800/50 relative z-10 overflow-hidden">
          
          {/* Subtle inner shadow/glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-50" />

          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-100 to-blue-100 mb-6 shadow-sm border border-white">
                <Lock className="w-7 h-7 text-slate-800" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Welcome Back</h1>
              <p className="text-slate-500 text-sm font-medium">Please enter your details to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-semibold">{errorMessage}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-500 ml-1  " htmlFor="email">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 mt-2 bg-slate-100/50 dark:bg-slate-800/50 border border-transparent rounded-xl text-sm font-medium focus:bg-white dark:focus:bg-slate-800 outline-none ring-offset-0 focus:ring-4 focus:ring-purple-500/5 focus:border-purple-200 transition-all placeholder:text-slate-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[14px] font-bold text-slate-500 " htmlFor="password">Password</label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-4 bg-slate-100/50 dark:bg-slate-800/50 border border-transparent rounded-xl text-sm font-medium focus:bg-white dark:focus:bg-slate-800 outline-none ring-offset-0 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all placeholder:text-slate-400"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 transition-all hover:translate-y-[-2px] hover:shadow-xl hover:shadow-slate-200 active:translate-y-[0px] disabled:opacity-70 disabled:cursor-not-allowed mt-4 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
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
              <p className="text-sm font-medium text-slate-400">
                Don&apos;t have an account?{' '}
                <a 
                  href="https://www.isobrain.ai/auth/sign-up"
                  target='_blank' 
                  className="text-slate-900 dark:text-white font-bold hover:underline underline-offset-4"
                >
                  Sign up free
                </a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer Link */}
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026 ISO BRAIN AI • PREMIER ACCESS</p>
        </div>
      </div>
    </div>
  )
}
