import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Upload, AlertCircle, Loader, Check } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useAuthStore } from '../store/authStore';
import { updateProfile, uploadProfilePhoto, AuthError } from '../lib/auth';
import { supabase } from '../lib/supabase';

const NEPAL_CITIES = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Biratnagar', 'Janakpur', 'Dharan', 'Birgunj', 'Butwal', 'Nepalgunj'];

export default function CompleteProfilePage() {
  const { user, profile, fetchProfile } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(profile?.profile_photo || '');
  const [formData, setFormData] = useState({
    city: profile?.city || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city) {
      setError('City is required');
      return;
    }
    if (!formData.phone) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);
    try {
      // Upload photo if selected
      if (photoFile && user.id) {
        await uploadProfilePhoto(user.id, photoFile);
      }

      // Update profile
      await updateProfile(user.id, {
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
      });

      // Refresh profile
      await fetchProfile(user.id);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 pt-20 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-heading text-gray-900 mb-2">Complete Your Profile</h1>
            <p className="text-gray-600">Add your photo and location details</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 space-y-8">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Profile Photo</label>
              <div className="flex items-end gap-6">
                {/* Preview */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Add photo</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Input */}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-input"
                    disabled={loading}
                  />
                  <label htmlFor="photo-input" className="block">
                    <div className="px-6 py-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 cursor-pointer hover:bg-blue-100 transition-smooth text-center">
                      <Upload size={24} className="text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-blue-600">Click to upload</p>
                      <p className="text-xs text-blue-500">JPG, PNG (max 5MB)</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">City/Location</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                  disabled={loading}
                >
                  <option value="">Select your city</option>
                  {NEPAL_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+977 98XXXXXXXX"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email (Display Only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader size={18} className="animate-spin" />}
                {loading ? 'Saving...' : 'Complete Profile'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-smooth disabled:opacity-50"
              >
                Skip for now
              </button>
            </div>

            {/* Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Check size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                You can update your profile anytime in settings. Adding a photo increases your profile visibility.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
