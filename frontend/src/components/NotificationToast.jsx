import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useReports } from '../contexts/ReportsContext';

const RADIUS_METERS = 200; // notify if within 200m

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const NotificationToast = ({ userLocation }) => {
  const { reports } = useReports();
  const notifiedIds = useRef(new Set());

  useEffect(() => {
    if (!userLocation) return;

    reports.forEach(report => {
      const distance = haversineDistance(
        userLocation.lat, userLocation.lng,
        report.lat, report.lng
      );
      if (distance <= RADIUS_METERS && !notifiedIds.current.has(report.id)) {
        notifiedIds.current.add(report.id);
        toast.error(`⚠️ ${report.type.toUpperCase()} ahead! ${report.gemini_tip || "Please be cautious."}`, {
          duration: 5000,
          position: "top-center",
        });
      }
    });
  }, [userLocation, reports]);

  return null;
};