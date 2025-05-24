// src/pages/Login.jsx
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { ClipLoader } from 'react-spinners'
import {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  createUserProfile,
} from '../firebase'

const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
})

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard')
    }
  }, [navigate])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const { user } = await signInWithEmailAndPassword(auth, data.email, data.password)
      await createUserProfile(user)
      const idToken = await user.getIdToken()
      localStorage.setItem('token', idToken)
      localStorage.setItem('uid', user.uid)
      localStorage.setItem('email', user.email)
      navigate('/dashboard')
    } catch {
      alert('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { user } = await signInWithPopup(auth, googleProvider)
      await createUserProfile(user)
      const idToken = await user.getIdToken()
      localStorage.setItem('token', idToken)
      localStorage.setItem('uid', user.uid)
      localStorage.setItem('email', user.email)
      navigate('/dashboard')
    } catch {
      alert('Google Sign-In failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-[url('/bggg.jpg')] bg-cover bg-center opacity-80"></div>

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
          <ClipLoader color="#34D399" size={50} />
        </div>
      )}

      {/* Form container */}
      <div className="w-full max-w-md relative z-20">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800/50 p-4 rounded-full backdrop-blur-sm">
            <div className="text-emerald-400 text-3xl font-bold">ECO</div>
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700/50">
          <h2 className="text-2xl font-bold mb-1 text-gray-100 text-center">Welcome Back</h2>
          <p className="text-emerald-400 text-center mb-8 opacity-80">Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="Email"
                  className="w-full bg-gray-900/50 border border-gray-700 focus:border-emerald-500 rounded-lg py-3 pl-10 pr-3 text-gray-100 placeholder-gray-400 outline-none transition-all duration-300"
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                <input
                  type="password"
                  {...register('password')}
                  placeholder="Password"
                  className="w-full bg-gray-900/50 border border-gray-700 focus:border-emerald-500 rounded-lg py-3 pl-10 pr-3 text-gray-100 placeholder-gray-400 outline-none transition-all duration-300"
                />
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="group w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              <span>{isSubmitting ? 'Signing In…' : 'Sign In'}</span>
              <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-8 text-center text-gray-300">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Create Account
            </Link>
          </p>
        </div>

        <div className="text-center mt-6 text-gray-900/70 text-sm">
          &copy; {new Date().getFullYear()} EcoLogin. All rights reserved.
        </div>
      </div>
    </div>
  )
}
