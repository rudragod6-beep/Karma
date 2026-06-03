import Navigation from '../components/Navigation';

export default function FtlNewPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-20 pb-20">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold font-heading">Post a New Alert</h1>
        </div>
      </div>
    </div>
  );
}
