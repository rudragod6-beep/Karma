import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export default function Navigation() {
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Logo - Top left */}
        <Link to="/" className="flex items-center gap-1 flex-shrink-0">
          <div className="font-bold text-lg md:text-xl text-blue-600">HAMRO KARMA</div>
          <div className="text-xs text-blue-600 font-medium hidden sm:block">हाम्रो कर्म</div>
        </Link>

        {/* F-Pattern: Desktop menu - Center horizontal */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/services"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-smooth"
          >
            Find Services
          </Link>
          <Link
            to="/ftl"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-smooth"
          >
            Find The Lost
          </Link>
          <Link
            to="/leaderboard"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-smooth"
          >
            Leaderboard
          </Link>
        </div>

        {/* Right side - Auth buttons & Profile */}
        <div className="flex items-center gap-3 md:gap-4">
          {user && profile ? (
            <>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-smooth relative">
                <Bell size={20} />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-smooth"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={16} className="text-gray-600" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to={profile.account_type === 'PROVIDER' ? '/provider/profile' : '/settings'}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      to={profile.account_type === 'PROVIDER' ? '/provider/dashboard' : '/dashboard'}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-smooth"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 md:px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-smooth"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-smooth"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile F-Pattern menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white py-2 space-y-1">
          <Link
            to="/services"
            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            Find Services
          </Link>
          <Link
            to="/ftl"
            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            Find The Lost
          </Link>
          <Link
            to="/leaderboard"
            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 rounded-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            Leaderboard
          </Link>
        </div>
      )}
    </nav>
  );
}
