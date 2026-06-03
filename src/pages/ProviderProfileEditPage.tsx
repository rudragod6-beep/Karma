import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Award, Loader, AlertCircle, Save, Upload } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useAuthStore } from '../store/authStore';
import { updateProfile, uploadProfilePhoto, AuthError } from '../lib/auth';
import { supabase } from '../lib/supabase';

const NEPAL_CITIES = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Biratnagar', 'Janakpur', 'Dharan', 'Birgunj', 'Butwal', 'Nepalgunj'];

const PROFESSIONS = [
  'Plumber',
  'Electrician',
  'Carpenter',
  'Painter',
  'AC Technician',
  'Phone & Computer Repair',
  'House Cleaner',
  'Home Tutor',
  'Driver',
  'Gardener',
  'Mason',
  'Welder',
];

export default function ProviderProfileEditPage() {
  const { user, profile, fetchProfile } = useAuthStore();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(profile?.profile_photo || '');

  const [formData, setFormData] = useState({
    profession: '',
    service_area: '',
    experience: 0,
    hourly_rate: 0,
    bio: '',
    skills: [] as string[],
    languages: [] as string[],
  });

  useEffect(() => {
    const fetchProvider = async () => {
      if (!profile?.id) return;
      try {
        const { data } = await supabase
          .from('service_providers')
          .select('*')
          .eq('user_id', profile.id)
          .maybeSingle();

        if (data) {
          setProvider(data);
          setFormData({
            profession: data.profession || '',
            service_area: data.service_area || '',
            experience: data.experience || 0,
            hourly_rate: data.hourly_rate || 0,
            bio: data.bio || '',
            skills: data.skills || [],
            languages: data.languages || [],
          });
          if (data.profile_photo) setPhotoPreview(data.profile_photo);
        }
      } catch (error) {
        console.error('Error fetching provider:', error);
      }
    };

    fetchProvider();
  }, [profile?.id]);

  if (!user || !profile) {
    navigate('/login');
    return null;
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'experience' || name === 'hourly_rate') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSkill = () => {
    const skill = prompt('Enter a skill (e.g., "Plumbing repair", "Water heater installation")');
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleAddLanguage = () => {
    const lang = prompt('Enter language (e.g., "English", "Nepali", "Hindi")');
    if (lang && !formData.languages.includes(lang)) {
      setFormData((prev) => ({ ...prev, languages: [...prev.languages, lang] }));
    }
  };

  const handleRemoveLanguage = (langToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== langToRemove),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.profession) {
        setError('Profession is required');
        setSaving(false);
        return;
      }
      if (!formData.service_area) {
        setError('Service area is required');
        setSaving(false);
        return;
      }

      // Upload photo if selected
      if (photoFile && user.id) {
        await uploadProfilePhoto(user.id, photoFile);
      }

      // Update provider data
      if (provider?.id) {
        const { error: updateError } = await supabase
          .from('service_providers')
          .update({
            profession: formData.profession,
            service_area: formData.service_area,
            experience: formData.experience,
            hourly_rate: formData.hourly_rate,
            bio: formData.bio,
            skills: formData.skills,
            languages: formData.languages,
            profile_completion: calculateCompletion(),
          })
          .eq('id', provider.id);

        if (updateError) throw new AuthError(updateError.message);
      }

      // Update profile
      await updateProfile(user.id, {
        city: formData.service_area,
      });

      await fetchProfile(user.id);
      setSuccess('Profile updated successfully!');
      setPhotoFile(null);
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError('Failed to save profile');
      }
    } finally {
      setSaving(false);
    }
  };

  const calculateCompletion = () => {
    let completed = 0;
    if (formData.profession) completed += 20;
    if (formData.service_area) completed += 20;
    if (formData.bio) completed += 20;
    if (formData.experience > 0) completed += 20;
    if (formData.hourly_rate > 0) completed += 20;
    return completed;
  };

  const completion = calculateCompletion();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Profile Header with Photo Background */}
      <div className="relative h-48 bg-gradient-to-r from-amber-500 to-amber-600 overflow-hidden">
        {photoPreview && <img src={photoPreview} alt="Profile background" className="w-full h-full object-cover opacity-30" />}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/80 to-amber-600/80"></div>

        <div className="relative h-full flex items-end px-4 md:px-6 pb-6">
          <div className="flex items-end gap-6">
            {/* Avatar */}
            <div className="relative -mb-16">
              <div className="w-32 h-32 rounded-2xl bg-white shadow-lg flex items-center justify-center overflow-hidden border-4 border-white">
                {photoPreview ? (
                  <img src={photoPreview} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl font-bold text-amber-600">{profile.name.charAt(0).toUpperCase()}</div>
                )}
              </div>
            </div>

            {/* Name & Status */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold font-heading text-white">{profile.name}</h1>
              <p className="text-amber-100">{formData.profession || 'Service Provider'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Profile Completion Progress */}
        <div className="mb-8 bg-white rounded-lg shadow-card p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Profile Completion</h2>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all" style={{ width: `${completion}%` }}></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{completion}% complete</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Photo Upload */}
          <div className="bg-white rounded-lg shadow-card p-8">
            <h2 className="text-lg font-bold font-heading text-gray-900 mb-6">Profile Photo</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-input"
            />
            <label htmlFor="photo-input">
              <div className="px-6 py-8 border-2 border-dashed border-amber-300 rounded-lg bg-amber-50 cursor-pointer hover:bg-amber-100 transition-smooth text-center">
                <Upload size={32} className="text-amber-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-amber-600">Click to upload new photo</p>
                <p className="text-xs text-amber-500">JPG, PNG (max 5MB)</p>
              </div>
            </label>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-card p-8 space-y-6">
            <h2 className="text-lg font-bold font-heading text-gray-900">Professional Information</h2>

            {/* Profession */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Profession/Trade</label>
              <div className="relative">
                <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                >
                  <option value="">Select your profession</option>
                  {PROFESSIONS.map((prof) => (
                    <option key={prof} value={prof}>
                      {prof}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Service Area</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  name="service_area"
                  value={formData.service_area}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                >
                  <option value="">Select your service area</option>
                  {NEPAL_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                min="0"
                max="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate (NPR)</label>
              <input
                type="number"
                name="hourly_rate"
                value={formData.hourly_rate}
                onChange={handleInputChange}
                min="0"
                step="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">This is a starting rate. Final price is negotiated with each customer.</p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">About You</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell customers about your experience, specialties, and approach to work..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow-card p-8">
            <h2 className="text-lg font-bold font-heading text-gray-900 mb-6">Skills & Languages</h2>

            {/* Skills */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-700">Skills</label>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="text-sm px-3 py-1 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-smooth"
                >
                  + Add Skill
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.length === 0 ? (
                  <p className="text-sm text-gray-500">No skills added yet</p>
                ) : (
                  formData.skills.map((skill) => (
                    <div key={skill} className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-amber-900"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Languages */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-700">Languages</label>
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="text-sm px-3 py-1 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-smooth"
                >
                  + Add Language
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.languages.length === 0 ? (
                  <p className="text-sm text-gray-500">No languages added yet</p>
                ) : (
                  formData.languages.map((lang) => (
                    <div key={lang} className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      <span>{lang}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(lang)}
                        className="hover:text-blue-900"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="bg-white rounded-lg shadow-card p-8">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-smooth disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader size={18} className="animate-spin" />}
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
