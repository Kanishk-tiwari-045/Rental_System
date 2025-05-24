// src/pages/Booking.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { MapPin, Calendar, Clock } from 'lucide-react'
import { auth, db, serverTimestamp } from '../firebase'
import { doc, getDoc, collection, addDoc } from 'firebase/firestore'

export default function Booking() {
  const { vehicleId } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadVehicle() {
      const snap = await getDoc(doc(db, 'vehicles', vehicleId))
      if (snap.exists()) setVehicle({ id: snap.id, ...snap.data() })
      else alert('Vehicle not found')
    }
    loadVehicle()
  }, [vehicleId])

  if (!vehicle) {
    return <div className="p-6 text-center text-emerald-400">Loading vehicle...</div>
  }

  const calculateTotal = () => {
    const days = Math.max(
      1,
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
    )
    return days * vehicle.pricePerDay
  }

  const handleBooking = async () => {
    setLoading(true)
    try {
      const bookingData = {
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        startDate,
        endDate,
        totalAmount: calculateTotal(),
        userId: auth.currentUser.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
      }
      const { id } = await addDoc(collection(db, 'bookings'), bookingData)
      navigate(`/checkout/${id}`)
    } catch (err) {
      console.error(err)
      alert('Could not place booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">{vehicle.name}</h2>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 text-emerald-400">
            <MapPin size={18} />
            <span>{vehicle.location}</span>
          </div>

          <div className="space-y-3">
            <label className="block text-gray-300 flex items-center gap-2">
              <Calendar size={16} /> Pickup Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              minDate={new Date()}
              className="w-full bg-gray-700 text-gray-100 rounded-lg p-2"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-gray-300 flex items-center gap-2">
              <Clock size={16} /> Return Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              minDate={startDate}
              className="w-full bg-gray-700 text-gray-100 rounded-lg p-2"
            />
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4 mb-6 text-gray-100 flex justify-between">
          <span>
            Total (
            {Math.max(
              1,
              Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
            )}{' '}
            days)
          </span>
          <span className="font-bold">${calculateTotal()}</span>
        </div>

        <button
          onClick={handleBooking}
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Continue to Payment'}
        </button>
      </div>
    </div>
  )
}
