// src/pages/Register.jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, UserPlus } from 'lucide-react'
import { ClipLoader } from 'react-spinners'
import {
  auth,
  createUserWithEmailAndPassword,
  createUserProfile,
} from '../firebase'

const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

export default function Register() {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // 1) Create the user in Firebase Auth
      const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password)

      // 2) Create/update the Firestore user profile
      await createUserProfile(user)

      // 3) Grab the ID token for session storage
      const idToken = await user.getIdToken()

      // 4) Store session info in localStorage
      localStorage.setItem('token', idToken)
      localStorage.setItem('uid', user.uid)
      localStorage.setItem('email', user.email)

      // 5) Redirect to Dashboard
      navigate('/dashboard')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background image overlay */}
      <div className="absolute inset-0 bg-[url('/bggg.jpg')] bg-cover bg-center opacity-80"></div>

      {/* Loading spinner overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
          <ClipLoader color="#34D399" size={50} />
        </div>
      )}

      {/* Form container */}
      <div className="w-full max-w-md relative z-20">
        <div className="bg-gray-800/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700/50">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-full">
              <UserPlus size={28} className="text-emerald-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-1 text-gray-100 text-center">Create Account</h2>
          <p className="text-emerald-400 text-center mb-8 opacity-80">
            Join our eco-friendly community
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                <input
                  {...formRegister('email')}
                  placeholder="Email"
                  className="w-full bg-gray-900/50 border border-gray-700 focus:border-emerald-500 rounded-lg py-3 pl-10 pr-3 text-gray-100 placeholder-gray-400 outline-none transition-all duration-300"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                <input
                  type="password"
                  {...formRegister('password')}
                  placeholder="Password"
                  className="w-full bg-gray-900/50 border border-gray-700 focus:border-emerald-500 rounded-lg py-3 pl-10 pr-3 text-gray-100 placeholder-gray-400 outline-none transition-all duration-300"
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1 ml-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="group w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              <span>{isSubmitting ? 'Creating…' : 'Create Account'}</span>
              <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-8 text-center text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Sign In
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
