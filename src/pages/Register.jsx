import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, UserPlus } from 'lucide-react';

const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    localStorage.setItem('registeredUser', JSON.stringify(data));
    alert('Registration successful! Please login.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3847682/pexels-photo-3847682.jpeg')] bg-cover bg-center opacity-10"></div>
      
      <div className="w-full max-w-md">
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-full">
              <UserPlus size={28} className="text-emerald-300" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-1 text-white text-center">Create Account</h2>
          <p className="text-emerald-200 text-center mb-8 opacity-80">Join our eco-friendly community</p>
          
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
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
              <span>Create Account</span>
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </form>
          
          <p className="mt-8 text-center text-emerald-200">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-300 hover:text-emerald-100 font-medium transition-colors duration-300">
              Sign In
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

export default Register;