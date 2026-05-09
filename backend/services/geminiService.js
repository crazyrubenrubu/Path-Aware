import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Use a model that exists in your list
const MODEL_NAME = "gemini-2.5-flash";  // ✅ confirmed from your model list
const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

export async function getAccessibilityTip(issueType, description, lat, lng) {
  try {
    const prompt = `You are an accessibility assistant. A user reported a mobility hazard:
Type: ${issueType}
Description: ${description}
Location: (${lat}, ${lng})
Provide a short, helpful tip (max 40 words) for wheelchair users or pedestrians to safely navigate around this obstacle.`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini tip error:", error);
    return "Please avoid this area if possible. Check for alternate routes.";
  }
}

export async function analyzeHazardFromImage(base64Image, mimeType = "image/jpeg") {
  try {
    if (!GEMINI_API_KEY) throw new Error("Missing API key");

    const prompt = `You are a mobility hazard detection assistant. Analyze this image and return ONLY a valid JSON object with exactly these keys:
- "type": one of ["pothole", "blocked_ramp", "elevator_broken", "construction", "broken_road", "invalid"]
- "description": a short (15 words) description of what you see
- "tip": a 20‑word actionable accessibility tip (or "No tip" if type is "invalid")

If the image does NOT show any mobility hazard for wheelchair users or pedestrians (e.g., random objects, people, landscapes, text, empty spaces, or anything unrelated to road/path hazards), set "type" to "invalid", description to "Image does not show a relevant hazard", and tip to "Please upload a photo of a pothole, blocked ramp, broken elevator, construction, or uneven road."

Do not include any other text, markdown, or explanations. The response must be parseable by JSON.parse().`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data: base64Image } }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    console.log("📥 Gemini raw response:", responseText);

    let jsonStr = responseText.trim();
    jsonStr = jsonStr.replace(/```json\s*|\s*```/g, '');
    const parsed = JSON.parse(jsonStr);

    if (!parsed.type || !parsed.description || !parsed.tip) {
      throw new Error("Missing required fields");
    }
    return parsed;
  } catch (error) {
    console.error("❌ Gemini vision error:", error.message);
    // Default fallback – also mark as invalid if we cannot determine
    return {
      type: "invalid",
      description: "Unable to analyze image. Please try again.",
      tip: "Make sure the photo is clear and shows a road/path hazard."
    };
  }
}