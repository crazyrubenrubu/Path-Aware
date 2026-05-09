import sqlite3 from 'sqlite3';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { getAccessibilityTip, analyzeHazardFromImage } from '../services/geminiService.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new sqlite3.Database(`${__dirname}/../db/reports.db`);

export const getAllReports = (req, res) => {
  db.all("SELECT * FROM reports ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

export const createReport = async (req, res) => {
  const { lat, lng, type, description } = req.body;
  if (!lat || !lng || !type) {
    return res.status(400).json({ error: "lat, lng, type required" });
  }
  const geminiTip = await getAccessibilityTip(type, description || "", lat, lng);
  db.run(
    "INSERT INTO reports (lat, lng, type, description, gemini_tip) VALUES (?, ?, ?, ?, ?)",
    [lat, lng, type, description || "", geminiTip],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        id: this.lastID,
        lat, lng, type, description,
        gemini_tip: geminiTip,
        created_at: new Date().toISOString()
      });
    }
  );
};

export const createReportFromImage = async (req, res) => {
  try {
    console.log("📸 Image upload request received");
    const lat = parseFloat(req.body.lat);
    const lng = parseFloat(req.body.lng);
    
    if (isNaN(lat) || isNaN(lng) || !req.file) {
      return res.status(400).json({ error: "Valid lat, lng and image file required" });
    }
    
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    
    const analysis = await analyzeHazardFromImage(base64Image, mimeType);
    console.log("✅ AI analysis result:", analysis);
    
    // ✅ NEW: Reject invalid images – do NOT save to DB
    if (analysis.type === "invalid") {
      return res.status(400).json({ 
        error: "Invalid image", 
        message: analysis.description || "This image does not show a valid mobility hazard. Please upload a photo of a pothole, blocked ramp, broken elevator, or construction." 
      });
    }
    
    const { type, description, tip } = analysis;
    const geminiTip = tip || "Use caution near this hazard.";
    
    db.run(
      "INSERT INTO reports (lat, lng, type, description, gemini_tip) VALUES (?, ?, ?, ?, ?)",
      [lat, lng, type, description, geminiTip],
      function(err) {
        if (err) {
          console.error("DB insert error:", err);
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
          id: this.lastID,
          lat, lng, type, description,
          gemini_tip: geminiTip,
          created_at: new Date().toISOString()
        });
      }
    );
  } catch (error) {
    console.error("❌ createReportFromImage error:", error);
    res.status(500).json({ error: "Image processing failed: " + error.message });
  }
};