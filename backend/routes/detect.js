/**
 * POST /api/detect
 * Accepts a multipart form with a leaf image.
 * Sends the image to Gemini Vision for AI disease analysis.
 * Returns disease info + matched treatment products from the database.
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../db');

// ─── Multer config (store in memory, 10MB limit) ────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPG, PNG, and WEBP images are supported.'));
  },
});

const DISEASE_SLUGS = [
  'powdery-mildew', 'early-blight', 'late-blight', 'leaf-rust',
  'bacterial-leaf-spot', 'root-rot', 'nitrogen-deficiency', 'healthy',
];

// ─── Route ────────────────────────────────────────────────────────────────────
router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded. Please upload a leaf photo.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('[detect] GEMINI_API_KEY not set — returning demo result');
    return sendDemoResult(req, res);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert plant pathologist AI integrated into the AgriGuardian AI platform.

Analyze this plant leaf image and provide a detailed diagnosis in the following strict JSON format. Do NOT include any text outside the JSON object.

{
  "is_plant_leaf": true or false,
  "disease_slug": "<one of: powdery-mildew, early-blight, late-blight, leaf-rust, bacterial-leaf-spot, root-rot, nitrogen-deficiency, healthy>",
  "disease_name": "<common name of the disease>",
  "confidence": <number between 0.0 and 1.0>,
  "severity": "<one of: early, moderate, advanced>",
  "affected_area_percent": <estimated percentage of leaf affected, 0-100>,
  "diagnosis_explanation": "<2-3 sentence plain-language explanation of what you see and why you identified this disease>",
  "symptoms_observed": ["<symptom 1>", "<symptom 2>", "<symptom 3>"],
  "immediate_action": "<one sentence on what the farmer should do right now>",
  "irrigation_impact": "<one sentence on how this affects irrigation decisions>"
}

Important rules:
- If the image does not show a plant leaf, set is_plant_leaf to false and all other fields to null.
- disease_slug MUST be exactly one of the provided options.
- confidence should reflect your actual certainty.
- Keep explanations farmer-friendly.`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { mimeType: req.file.mimetype, data: req.file.buffer.toString('base64') } },
    ]);

    const rawText = result.response.text().trim();
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Gemini returned an unexpected response format.');

    const aiResult = JSON.parse(jsonMatch[0]);

    if (!aiResult.is_plant_leaf) {
      return res.status(422).json({
        error: 'no_leaf',
        message: 'No plant leaf detected in this image. Please upload a clear photo of a plant leaf.',
      });
    }

    const slug = DISEASE_SLUGS.includes(aiResult.disease_slug) ? aiResult.disease_slug : 'healthy';
    return buildAndSendResult(res, aiResult, slug, req.file.originalname);

  } catch (err) {
    console.error('[detect] Error:', err.message);
    if (err.message?.includes('API key')) {
      return res.status(401).json({ error: 'Invalid Gemini API key. Check your .env file.' });
    }
    return sendDemoResult(req, res, err.message);
  }
});

function buildAndSendResult(res, aiResult, slug, imageName, isDemo = false, demoNote = null) {
  const diseaseRecord = db.getDiseaseBySlug(slug);
  const treatments = diseaseRecord ? db.getTreatmentProducts(diseaseRecord) : [];
  const severityMap = diseaseRecord?.severity_map || {};
  const severityAdvice = severityMap[aiResult.severity] || severityMap.early || '';

  // Save scan to history
  db.addScanHistory({
    disease_name: aiResult.disease_name,
    confidence: aiResult.confidence,
    severity: aiResult.severity,
    image_name: imageName || 'unknown',
    slug,
  });

  return res.json({
    success: true,
    demo_mode: isDemo,
    demo_note: demoNote,
    result: {
      ...aiResult,
      disease_slug: slug,
      severity_advice: severityAdvice,
      irrigation_recommendation: diseaseRecord?.irrigation_advice || null,
      disease_info: diseaseRecord ? { cause: diseaseRecord.cause, symptoms: diseaseRecord.symptoms } : null,
    },
    treatments,
  });
}

function sendDemoResult(req, res, errorNote = null) {
  const demoAI = {
    is_plant_leaf: true,
    disease_slug: 'powdery-mildew',
    disease_name: 'Powdery Mildew',
    confidence: 0.942,
    severity: 'moderate',
    affected_area_percent: 38,
    diagnosis_explanation: 'The leaf shows characteristic white, powdery fungal colonies concentrated on the upper surface. The circular growth pattern and powdery texture are hallmark signs of Erysiphe spp. infection at moderate stage.',
    symptoms_observed: ['White powdery coating on upper leaf surface', 'Yellowing around affected patches', 'Slight leaf curling at edges'],
    immediate_action: 'Isolate affected plants and apply a copper-based or sulfur fungicide within 24 hours.',
    irrigation_impact: 'Reduce irrigation frequency to lower ambient humidity — moist conditions accelerate fungal spread.',
  };

  const note = errorNote
    ? `AI error (${errorNote}) — showing demo result`
    : 'Set GEMINI_API_KEY in backend/.env to enable real AI analysis';

  return buildAndSendResult(res, demoAI, 'powdery-mildew', req.file?.originalname || 'demo', true, note);
}

module.exports = router;
