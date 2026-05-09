import { useState } from 'react';
import { Link } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import ReportsList from '../components/ReportsList';
import { NotificationToast } from '../components/NotificationToast';
import { useGeolocation } from '../hooks/useGeolocation';
import { useReports } from '../contexts/ReportsContext';
import { useTheme } from '../contexts/ThemeContext';
import QuickReportBar from '../components/QuickReportBar';
import ImageCapture from '../components/ImageCapture';
import ReportForm from '../components/ReportForm'; // Make sure this is imported!

export default function MapDashboard() {
  const [clickedPos, setClickedPos] = useState(null);
  const [showQuickBar, setShowQuickBar] = useState(false);
  const [showImageCapture, setShowImageCapture] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false); // New state for the form
  
  const { reports } = useReports();
  const { location: userLocation, error: geoError } = useGeolocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const closeQuickBar = () => {
    setShowQuickBar(false);
    setClickedPos(null);
  };

  const openImageCapture = () => {
    setShowQuickBar(false);
    setShowImageCapture(true);
  };

  const openManualReport = () => {
    setShowQuickBar(false);
    setShowReportForm(true);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
      
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between transition-colors duration-300">
        <div>
          {/* Logo is now a Link, Home button removed from the right side */}
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-teal-500 text-3xl">♿</span> 
              Path<span className="text-teal-500">Aware</span>
            </h1>
          </Link>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Tap map → adjust pin → report hazard
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-teal-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all shadow-sm"
            title="Toggle Theme"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative z-0">
          <MapComponent
            reports={reports}
            userLocation={userLocation}
            clickedPos={clickedPos}
            setClickedPos={setClickedPos}
            setShowQuickBar={setShowQuickBar}
          />
          
          {showQuickBar && clickedPos && (
            <QuickReportBar 
              position={clickedPos} 
              onClose={closeQuickBar} 
              onImageCapture={openImageCapture} 
              onManual={openManualReport} 
            />
          )}
          
          {showImageCapture && clickedPos && (
            <ImageCapture position={clickedPos} onClose={() => setShowImageCapture(false)} />
          )}

          {/* Render the new ReportForm Modal */}
          {showReportForm && clickedPos && (
            <ReportForm position={clickedPos} onClose={() => { setShowReportForm(false); setClickedPos(null); }} />
          )}
        </div>
        
        <div className="w-[350px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors duration-300 shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.1)]">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/50">
            {geoError && (
              <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                ⚠️ {geoError}
              </div>
            )}
            {userLocation && (
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-sm font-medium bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg border border-teal-100 dark:border-teal-800/50">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                </span>
                Live tracking active
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <ReportsList />
          </div>
        </div>
      </div>
      
      <NotificationToast userLocation={userLocation} />
    </div>
  );
}