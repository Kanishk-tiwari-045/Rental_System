import { useNavigate } from 'react-router-dom';
import { LogOut, Car, Calendar, MapPin, Clock, User } from 'lucide-react';

function Dashboard() {
  const email = localStorage.getItem('email');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const carListings = [
    {
      id: 1,
      name: 'Tesla Model 3',
      location: 'San Francisco',
      price: '75',
      image: 'https://images.pexels.com/photos/7674867/pexels-photo-7674867.jpeg',
    },
    {
      id: 2,
      name: 'BMW i3',
      location: 'Los Angeles',
      price: '65',
      image: 'https://images.pexels.com/photos/3566167/pexels-photo-3566167.jpeg',
    },
    {
      id: 3,
      name: 'Nissan Leaf',
      location: 'Seattle',
      price: '45',
      image: 'https://images.pexels.com/photos/3608542/pexels-photo-3608542.jpeg',
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, {email}</h1>
            <p className="text-emerald-200">Find your perfect eco-friendly ride</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carListings.map((car) => (
            <div key={car.id} className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
              <img src={car.image} alt={car.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-2">{car.name}</h3>
                <div className="space-y-2 text-emerald-200">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{car.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>Available Now</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Flexible Rental Period</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">${car.price}<span className="text-sm text-emerald-200">/day</span></span>
                  <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg transition-colors duration-300">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;