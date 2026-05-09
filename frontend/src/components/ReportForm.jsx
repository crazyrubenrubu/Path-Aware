import { useState } from 'react';
import { useReports } from '../contexts/ReportsContext';
import { createReport } from '../services/api';   // <- fixed import
import toast from 'react-hot-toast';

export default function ReportForm({ position, onClose }) {
  const { addReport } = useReports();
  const [type, setType] = useState('pothole');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newReport = await createReport({
        lat: position.lat,
        lng: position.lng,
        type,
        description,
      });
      addReport(newReport);
      toast.success('Hazard reported successfully!');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-800 dark:text-white">Submit Manual Report</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Hazard Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 outline-none focus:border-teal-500 transition-colors"
            >
              <option value="pothole">🕳️ Pothole / Uneven Surface</option>
              <option value="blocked_ramp">🚧 Blocked Ramp</option>
              <option value="elevator_broken">🛗 Broken Elevator</option>
              <option value="construction">🏗️ Construction Zone</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Deep pothole in the middle of the crosswalk..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 h-24 outline-none focus:border-teal-500 transition-colors resize-none"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}