import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, BookMarked, Star, Settings } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export default function CustomerDashboard() {
  const { profile } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ active: 0, completed: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id) return;
      try {
        const { data: bookingData } = await supabase
          .from('bookings')
          .select('*')
          .eq('customer_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setBookings(bookingData || []);

        // Calculate stats
        if (bookingData) {
          const active = bookingData.filter((b) => b.status === 'IN_PROGRESS').length;
          const completed = bookingData.filter((b) => b.status === 'COMPLETED').length;
          const totalSpent = bookingData
            .filter((b) => b.status === 'COMPLETED')
            .reduce((sum, b) => sum + (b.agreed_price || 0), 0);

          setStats({ active, completed, totalSpent });
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile?.id]);

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      REQUESTED: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-orange-100 text-orange-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
      DISPUTED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-20 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {profile?.name}!</p>
          </div>
          <Link
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth"
          >
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 font-medium">Active Bookings</p>
              <Calendar size={20} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
          </div>

          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 font-medium">Completed</p>
              <Star size={20} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
          </div>

          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 font-medium">Total Spent</p>
              <DollarSign size={20} className="text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">NPR {stats.totalSpent.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 font-medium">Saved Providers</p>
              <BookMarked size={20} className="text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-bold font-heading text-gray-900 mb-4">Recent Bookings</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center">
              <BookMarked size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No bookings yet</p>
              <Link to="/services" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                Browse services →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-smooth">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{booking.job_description.substring(0, 50)}...</p>
                    <p className="text-sm text-gray-600 mt-1">{booking.job_address}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">NPR {booking.agreed_price || '—'}</p>
                      <p className="text-xs text-gray-500">{new Date(booking.scheduled_date).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
