import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Welcome to <span className="text-teal-400">PathAware</span>
        </h1>
        <p className="text-lg text-slate-300">
          Real-time accessibility alerts and hazard detection. Navigate your world safely and smoothly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <Link
            to="/map"
            className="flex items-center justify-center p-4 bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-teal-500/25"
          >
            Open Map Dashboard
          </Link>
          <button
            className="flex items-center justify-center p-4 border border-slate-700 hover:border-teal-400 hover:text-teal-300 font-medium rounded-xl transition-all duration-300"
          >
            Settings & Options
          </button>
        </div>
      </div>
    </div>
  );
}