import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Calendar, Car, CreditCard } from 'lucide-react'

function Checkout() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const { bookingId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadRazorpay = async () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpay();
  }, []);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
        if (bookingDoc.exists()) {
          setBooking({ id: bookingDoc.id, ...bookingDoc.data() });
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
        alert('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handlePayment = async () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: booking.totalAmount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      name: 'Eco Rentals',
      description: `Booking for ${booking.vehicleName}`,
      order_id: '', // You'll need to generate this from your backend
      handler: async (response) => {
        try {
          await updateDoc(doc(db, 'bookings', bookingId), {
            status: 'confirmed',
            paymentId: response.razorpay_payment_id
          });
          navigate('/dashboard');
        } catch (error) {
          console.error('Payment verification failed:', error);
          alert('Payment verification failed. Please contact support.');
        }
      },
      prefill: {
        email: auth.currentUser.email
      },
      theme: {
        color: '#059669'
      }
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-emerald-400">Loading...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400">Booking not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
          <h1 className="text-2xl font-bold text-gray-100 mb-6">Checkout</h1>
          
          <div className="space-y-6">
            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-xl text-gray-100 mb-4">Booking Summary</h2>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center gap-2">
                  <Car size={18} className="text-emerald-400" />
                  <span>{booking.vehicleName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-emerald-400" />
                  <span>
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="border-b border-gray-700 pb-6">
              <h2 className="text-xl text-gray-100 mb-4">Payment Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${booking.totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>${(booking.totalAmount * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-100 mt-4">
                  <span>Total</span>
                  <span>${(booking.totalAmount * 1.18).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handlePayment}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard size={18} />
              <span>Pay Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;