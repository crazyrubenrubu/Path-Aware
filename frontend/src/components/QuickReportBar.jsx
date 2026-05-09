export default function QuickReportBar({ position, onClose, onImageCapture, onManual }) {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[1000] animate-fade-in-up">
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl flex flex-col items-center gap-3 w-80">
        
        <div className="flex justify-between items-center w-full pb-2 border-b border-slate-700/50">
          <span className="text-xs font-medium text-slate-300 tracking-wide uppercase">Location Selected</span>
          <button onClick={onClose} className="text-slate-400 hover:text-teal-400 transition-colors rounded-full p-1 hover:bg-slate-800">✕</button>
        </div>

        <p className="text-xs text-teal-300 font-mono">
          {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
        </p>

        <div className="flex gap-3 w-full mt-2">
          {/* Ensure onManual is attached to onClick here */}
          <button 
            onClick={onManual} 
            className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-all shadow-sm hover:shadow-teal-500/10"
          >
            ✍️ Manual
          </button>
          
          <button 
            onClick={onImageCapture}
            className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-900 text-sm font-bold py-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            📸 AI Scan
          </button>
        </div>
      </div>
    </div>
  );
}