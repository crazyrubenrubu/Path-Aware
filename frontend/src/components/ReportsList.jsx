import { useReports } from '../contexts/ReportsContext';

export default function ReportsList() {
  const { reports } = useReports();

  if (!reports || reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-500">
        <span className="text-4xl mb-3">🍃</span>
        <p className="text-sm font-medium">No hazards reported yet.</p>
        <p className="text-xs mt-1">The coast is clear!</p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch(type) {
      case 'pothole': return '🕳️';
      case 'blocked_ramp': return '🚧';
      case 'elevator_broken': return '🛗';
      case 'construction': return '🏗️';
      default: return '⚠️';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Recent Reports</h3>
      
      {reports.map((report) => (
        <div key={report.id} className="bg-white dark:bg-slate-800/80 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700/50 hover:border-teal-400 dark:hover:border-teal-500 transition-colors group">
          
          <div className="flex items-start gap-3 mb-2">
            <div className="text-2xl bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
              {getIcon(report.type)}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 dark:text-white capitalize text-sm">
                {report.type.replace('_', ' ')}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {new Date(report.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </p>
            </div>
          </div>
          
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 pl-1 leading-relaxed">
            {report.description}
          </p>
          
          {report.gemini_tip && (
            <div className="mt-4 bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg border border-teal-100 dark:border-teal-800/50">
              <p className="text-xs text-teal-800 dark:text-teal-300 flex items-start gap-2">
                <span className="shrink-0 text-base">💡</span>
                <span className="leading-tight pt-0.5">{report.gemini_tip}</span>
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}