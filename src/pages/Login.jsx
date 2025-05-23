import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const navigate = useNavigate();

  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const onSubmit = (data) => {
    const stored = JSON.parse(localStorage.getItem('registeredUser'));
    if (stored && stored.email === data.email && stored.password === data.password) {
      const token = btoa(`${data.email}:${data.password}`); // dummy JWT
      localStorage.setItem('token', token);
      localStorage.setItem('email', data.email);
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const { credential } = credentialResponse;
    // Decode JWT payload to extract email
    const payload = JSON.parse(atob(credential.split('.')[1]));
    const email = payload.email;
    // Store credential as token, and email
    localStorage.setItem('token', credential);
    localStorage.setItem('email', email);
    navigate('/dashboard');
  };

  const handleGoogleError = () => {
    alert('Google Sign-In failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-600 p-4">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3847682/pexels-photo-3847682.jpeg')] bg-cover bg-center opacity-10"></div>
      
      <div className="w-full max-w-md relative">
        {/* Logo/Brand at the top */}
        <div className="flex justify-center mb-6">
          <div className="bg-white bg-opacity-10 p-4 rounded-full backdrop-blur-sm">
            <div className="text-emerald-300 text-3xl font-bold">eco</div>
          </div>
        </div>
        
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10 w-full">
          <h2 className="text-2xl font-bold mb-1 text-white text-center">Welcome Back</h2>
          <p className="text-emerald-200 text-center mb-8 opacity-80">Sign in to your account</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300">
                  <Mail size={18} />
                </div>
                <input
                  {...register('email')}
                  placeholder="Email"
                  className="w-full bg-white/5 border border-emerald-600/30 focus:border-emerald-400 rounded-lg py-3 pl-10 pr-3 text-white placeholder-emerald-200/50 outline-none transition-all duration-300"
                />
              </div>
              {errors.email && (
                <p className="text-red-300 text-sm mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  placeholder="Password"
                  className="w-full bg-white/5 border border-emerald-600/30 focus:border-emerald-400 rounded-lg py-3 pl-10 pr-3 text-white placeholder-emerald-200/50 outline-none transition-all duration-300"
                />
              </div>
              {errors.password && (
                <p className="text-red-300 text-sm mt-1 ml-1">{errors.password.message}</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <a href="#" className="text-emerald-300 text-sm hover:text-emerald-200 transition-colors">
                Forgot password?
              </a>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              <span>Sign In</span>
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-emerald-700/50 absolute w-full"></div>
              <span className="bg-transparent text-emerald-300 text-sm px-4 relative">or continue with</span>
            </div>
            
            <div className="flex justify-center">
              <div className="p-1 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors duration-300">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_blue"
                  shape="circle"
                  size="large"
                />
              </div>
            </div>
          </form>
          
          <p className="mt-8 text-center text-emerald-200">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-300 hover:text-emerald-100 font-medium transition-colors duration-300">
              Create Account
            </Link>
          </p>
        </div>
        
        <div className="text-center mt-6 text-emerald-300/70 text-sm">
          &copy; {new Date().getFullYear()} EcoLogin. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Login;