import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ShieldCheck, Zap, Heart } from 'lucide-react';
import Navigation from '../components/Navigation';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold font-heading text-gray-900 mb-4">
              Find trusted local experts<br className="hidden sm:inline" /> in minutes
            </h1>
            <p className="text-xl text-gray-600 mb-8">Every professional on Hamro Karma is identity verified</p>

            <div className="bg-white rounded-2xl shadow-card p-4 max-w-2xl mx-auto mb-8 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg">
                <Search size={20} className="text-gray-400" />
                <input type="text" placeholder="What do you need help with?" className="bg-transparent outline-none w-full" />
              </div>
              <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg">
                <MapPin size={20} className="text-gray-400" />
                <input type="text" placeholder="Your area" className="bg-transparent outline-none w-full" />
              </div>
              <Link to="/services" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-smooth">
                Search
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-600" />
                <span>ID Verified Workers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={18} className="text-amber-500" />
                <span>Real Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-blue-600" />
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-heading text-gray-900 mb-12 text-center">Browse by profession</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {['🔧 Plumber', '⚡ Electrician', '🪵 Carpenter', '🎨 Painter', '❄️ AC Tech', '💻 Repair', '🧹 Cleaner', '📚 Tutor'].map((cat) => (
              <Link key={cat} to="/services" className="p-6 bg-gray-50 rounded-xl text-center hover:shadow-card transition-smooth cursor-pointer">
                <div className="text-3xl mb-2">{cat.split(' ')[0]}</div>
                <div className="font-semibold text-sm text-gray-700">{cat.split(' ')[1]}</div>
                <div className="text-xs text-gray-500 mt-1">50+ available</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-heading text-gray-900 mb-12 text-center">How it works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: 1, title: 'Search', desc: 'Find the right professional' },
              { num: 2, title: 'Verify', desc: 'Check their verified profile' },
              { num: 3, title: 'Book', desc: 'Send a job request' },
              { num: 4, title: 'Done', desc: 'Pay securely, leave review' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4 text-lg">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center pb-8 border-b border-gray-700">
            <h3 className="text-white font-bold text-2xl mb-2">HAMRO KARMA</h3>
            <p className="text-sm">Built for Nepal, built with trust</p>
          </div>
          <div className="text-center mt-8 text-sm">
            <p>© 2025 Hamro Karma | Made in Nepal</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
