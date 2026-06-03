import Navigation from '../components/Navigation';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold font-heading mb-8">Find Services</h1>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow-card">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
                <h3 className="font-bold text-gray-900 mb-1">Service Provider {i}</h3>
                <p className="text-sm text-gray-600">Profession • 4.5 stars (50 jobs)</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
