import Navigation from '../components/Navigation';
import { Link } from 'react-router-dom';

export default function FtlPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold font-heading mb-4">Find The Lost</h1>
          <p className="text-gray-600 mb-8">Community alert network for lost items, pets, and missing persons</p>
          <Link to="/ftl/new" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-smooth">
            Post an Alert
          </Link>
        </div>
      </div>
    </div>
  );
}
