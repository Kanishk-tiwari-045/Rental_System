// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { LogOut, MapPin, Calendar, Clock } from 'lucide-react'
import { auth, db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState([])
  const [userBookings, setUserBookings] = useState([])
  const email = localStorage.getItem('email')
  const uid = localStorage.getItem('uid')
  const navigate = useNavigate()

  useEffect(() => {
    async function loadData() {
      const vehiclesRef = getDocs(collection(db, 'vehicles'))
      const bookingsRef = uid
        ? getDocs(query(collection(db, 'bookings'), where('userId', '==', uid)))
        : Promise.resolve({ docs: [] })
      const [vSnap, bSnap] = await Promise.all([vehiclesRef, bookingsRef])

      setVehicles(vSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      setUserBookings(
        bSnap.docs.map(d => {
          const data = d.data()
          return {
            id: d.id,
            vehicleName: data.vehicleName,
            startDate: data.startDate.toDate(),
            endDate: data.endDate.toDate(),
            totalAmount: data.totalAmount,
            status: data.status,
          }
        })
      )
      setLoading(false)
    }
    loadData()
  }, [uid])

  const handleLogout = async () => {
    await auth.signOut()
    localStorage.clear()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <ClipLoader color="#34D399" size={50} />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      <header className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Welcome, {email}</h1>
          <p className="text-emerald-400">Find your perfect eco-friendly ride</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-100 px-4 py-2 rounded-lg"
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      {userBookings.length > 0 && (
        <section className="mb-12 max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Your Bookings</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {userBookings.map(b => (
              <div
                key={b.id}
                className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-gray-700/50"
              >
                <h3 className="text-lg font-semibold text-gray-100">{b.vehicleName}</h3>
                <p className="text-emerald-400 mt-2">
                  From: {b.startDate.toLocaleDateString()}
                  <br />
                  To: {b.endDate.toLocaleDateString()}
                </p>
                <p className="text-emerald-400 mt-1">Status: {b.status}</p>
                <p className="text-emerald-300 mt-2">Total: ${b.totalAmount}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Available Vehicles</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map(v => (
            <div
              key={v.id}
              className="bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700/50"
            >
              <img src={v.imageUrl} alt={v.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-100 mb-2">{v.name}</h3>
                <div className="space-y-2 text-emerald-400">
                  <div className="flex items-center gap-2"><MapPin size={16} /> {v.location}</div>
                  <div className="flex items-center gap-2"><Clock size={16} /> Available Now</div>
                  <div className="flex items-center gap-2"><Calendar size={16} /> ${v.pricePerDay}/day</div>
                </div>
                <div className="mt-4 text-right">
                  <Link
                    to={`/booking/${v.id}`}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
