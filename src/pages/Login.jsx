// src/pages/Login.jsx
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
})

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const navigate = useNavigate()

  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard')
    }
  }, [navigate])

  const onSubmit = (data) => {
    const stored = JSON.parse(localStorage.getItem('registeredUser'))
    if (stored && stored.email === data.email && stored.password === data.password) {
      const token = btoa(`${data.email}:${data.password}`) // dummy JWT
      localStorage.setItem('token', token)
      localStorage.setItem('email', data.email)
      navigate('/dashboard')
    } else {
      alert('Invalid credentials')
    }
  }

  const handleGoogleSuccess = (credentialResponse) => {
    const { credential } = credentialResponse
    // Decode JWT payload to extract email
    const payload = JSON.parse(atob(credential.split('.')[1]))
    const email = payload.email
    // Store credential as token, and email
    localStorage.setItem('token', credential)
    localStorage.setItem('email', email)
    navigate('/dashboard')
  }

  const handleGoogleError = () => {
    alert('Google Sign-In failed. Please try again.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Email / Password Form */}
        <input
          {...register('email')}
          placeholder="Email"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <p className="text-red-500 text-sm mb-2">{errors.email?.message}</p>

        <input
          type="password"
          {...register('password')}
          placeholder="Password"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <p className="text-red-500 text-sm mb-4">{errors.password?.message}</p>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 mb-4"
        >
          Login
        </button>

        <p className="text-center mb-4">— or —</p>

        {/* Google OAuth Button */}
        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
