import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, TrendingUp, Zap, Star, Settings, Trophy } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export default function ProviderDashboard() {
  const { profile } = useAuthStore();
  const [provider, setProvider] = useState<any>(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id) return;
      try {
        const { data: providerData } = await supabase
          .from('service_providers')
          .select('*')
          .eq('user_id', profile.id)
          .maybeSingle();

        setProvider(providerData);

        const { data: bookingData } = await supabase
          .from('bookings')
          .select('*')
          .eq('provider_id', providerData?.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setBookings(bookingData || []);
      } catch (error) {
        console.error('Error fetching provider data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile?.id]);

  const getKarmaColor = (level: string) => {
    const colors: Record<string, string> = {
      BRONZE: 'text-orange-600',
      SILVER: 'text-gray-500',
      GOLD: 'text-yellow-600',
      PLATINUM: 'text-purple-600',
    };
    return colors[level] || 'text-gray-600';
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      REQUESTED: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-orange-100 text-orange-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
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
            <h1 className="text-3xl font-bold font-heading text-gray-900">Provider Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your services and earnings</p>
          </div>
          <Link
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth"
          >
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>

        {/* Provider Status Card */}
        {provider && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-card p-6 text-white mb-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-blue-100 text-sm mb-1">Verification Status</p>
                <p className="text-xl font-bold">
                  {provider.verification_status === 'APPROVED' ? (
                    <span className="text-green-300 flex items-center gap-2">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="text-yellow-300">{provider.verification_status}</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Availability</p>
                <p className="text-xl font-bold">{provider.is_available ? 'Available' : 'Offline'}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Rating</p>
                <p className="text-xl font-bold flex items-center gap-2">
                  <Star size={16} />
                  {provider.average_rating.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Jobs Completed</p>
                <p className="text-xl font-bold">{provider.total_jobs_completed}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 font-medium">Pending Requests</p>
              <Clock size={20} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {bookings.filter((b) => b.status === 'REQUESTED').length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 font-medium">Active Jobs</p>
              <TrendingUp size={20} className="text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {bookings.filter((b) => b.status === 'IN_PROGRESS').length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 font-medium">Karma Points</p>
              <Trophy size={20} className={`${provider ? getKarmaColor(provider.karma_level) : 'text-gray-600'}`} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{provider?.karma_points || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 font-medium">Karma Level</p>
              <Zap size={20} className="text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{provider?.karma_level || 'NONE'}</p>
          </div>
        </div>

        {/* Job Requests */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-bold font-heading text-gray-900 mb-4">Recent Job Requests</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center">
              <Clock size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No job requests yet</p>
              <p className="text-sm text-gray-500 mt-1">Customers will send you requests based on your profile</p>
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
                      <p className="font-medium text-gray-900">
                        {booking.status === 'REQUESTED' ? 'Negotiable' : `NPR ${booking.agreed_price}`}
                      </p>
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
