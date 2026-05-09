import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { createReportWithImage } from '../services/api';
import { useReports } from '../contexts/ReportsContext';
import toast from 'react-hot-toast';

export default function ImageCapture({ position, onClose }) {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { addReport } = useReports();

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const uploadImage = async () => {
    if (!capturedImage || !position) return;
    setUploading(true);
    try {
      const blob = await fetch(capturedImage).then(r => r.blob());
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
      const newReport = await createReportWithImage(position.lat, position.lng, file);
      addReport(newReport);
      toast.success("Hazard reported successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400 && err.response?.data?.error === "Invalid image") {
        const description = err.response?.data?.message || "This image does not show a valid mobility hazard.";
        toast.error(`⛔ Invalid image: ${description}`);
      } else {
        toast.error("Failed to analyze image. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const retake = () => {
    if (uploading) return; // safety, but button is disabled anyway
    setCapturedImage(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[2000] p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-4">
        <h3 className="text-lg font-bold mb-2">📸 Report with Photo</h3>
        {!capturedImage ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full rounded mb-2"
            />
            <button onClick={capture} className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-2">
              Capture Photo
            </button>
            <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded w-full">
              Cancel
            </button>
          </>
        ) : (
          <>
            <img src={capturedImage} alt="Preview" className="w-full rounded mb-2" />
            <div className="flex gap-2">
              <button 
                onClick={uploadImage} 
                disabled={uploading} 
                className="bg-green-600 text-white px-4 py-2 rounded flex-1 disabled:opacity-50"
              >
                {uploading ? "Analyzing..." : "Submit & Let AI Detect"}
              </button>
              <button 
                onClick={retake} 
                disabled={uploading} 
                className="bg-gray-300 px-4 py-2 rounded flex-1 disabled:opacity-50"
              >
                Retake
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}