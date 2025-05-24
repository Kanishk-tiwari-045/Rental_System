// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Booking from './pages/Booking'       // ← booking page
import Checkout from './pages/Checkout'

export default function App() {
  const isAuthenticated = () => Boolean(localStorage.getItem('token'))

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated() ? '/dashboard' : '/login'} replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />}
      />
     <Route
       path="/booking/:vehicleId"
       element={isAuthenticated() ? <Booking /> : <Navigate to="/login" replace />}
     />
      <Route
        path="/checkout/:bookingId"
        element={isAuthenticated() ? <Checkout /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
