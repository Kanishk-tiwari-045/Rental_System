// src/pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const email = localStorage.getItem('email')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome, {email}</h1>
        <p className="mb-6">This is your car rental dashboard.</p>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Dashboard
