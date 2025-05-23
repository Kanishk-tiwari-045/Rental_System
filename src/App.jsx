import { Routes, Route, Navigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-600">
      <div className="fixed top-4 left-4 flex items-center gap-2 text-emerald-300">
        <Leaf size={24} />
        <span className="text-xl font-bold">eco</span>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;