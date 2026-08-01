/**
 * POST /api/irrigation
 * Smart Irrigation Advisor
 * Combines crop type, growth stage, soil moisture, temperature, humidity,
 * and a live weather forecast to recommend irrigation timing and volume.
 */

const express = require('express');
const router = express.Router();

// ─── Crop water requirement profiles ────────────────────────────────────────
// Base evapotranspiration multipliers (Kc) by growth stage
const CROP_PROFILES = {
  tomato:     { stages: { seedling: 0.45, vegetative: 0.75, flowering: 1.15, fruiting: 1.05, ripening: 0.8 }, root_depth_cm: 60 },
  potato:     { stages: { seedling: 0.45, vegetative: 0.75, flowering: 1.15, fruiting: 1.05, ripening: 0.75 }, root_depth_cm: 40 },
  rice:       { stages: { seedling: 1.05, vegetative: 1.2,  flowering: 1.25, fruiting: 1.1,  ripening: 0.95 }, root_depth_cm: 20 },
  wheat:      { stages: { seedling: 0.4,  vegetative: 0.7,  flowering: 1.15, fruiting: 1.05, ripening: 0.65 }, root_depth_cm: 100 },
  corn:       { stages: { seedling: 0.4,  vegetative: 0.8,  flowering: 1.2,  fruiting: 1.1,  ripening: 0.8 }, root_depth_cm: 80 },
  onion:      { stages: { seedling: 0.5,  vegetative: 0.75, flowering: 1.05, fruiting: 1.0,  ripening: 0.75 }, root_depth_cm: 30 },
  cucumber:   { stages: { seedling: 0.5,  vegetative: 0.7,  flowering: 1.0,  fruiting: 1.05, ripening: 0.85 }, root_depth_cm: 40 },
  spinach:    { stages: { seedling: 0.5,  vegetative: 0.9,  flowering: 1.0,  fruiting: 0.95, ripening: 0.85 }, root_depth_cm: 30 },
  default:    { stages: { seedling: 0.45, vegetative: 0.75, flowering: 1.05, fruiting: 1.0,  ripening: 0.8 }, root_depth_cm: 40 },
};

// ─── Soil type water-holding capacity (mm per cm depth) ─────────────────────
const SOIL_WHC = {
  sandy: 0.9,
  loamy: 1.5,
  clay:  2.0,
  silt:  1.8,
  default: 1.4,
};

// ─── Disease-based irrigation modifiers ─────────────────────────────────────
const DISEASE_MODIFIERS = {
  'powdery-mildew':      { multiplier: 0.6, reason: 'Powdery mildew thrives in high humidity — reduce watering to lower leaf moisture.' },
  'late-blight':         { multiplier: 0.4, reason: 'Late blight is water-borne — stop overhead irrigation immediately.' },
  'early-blight':        { multiplier: 0.75, reason: 'Early blight spreads in wet conditions — reduce frequency and use drip.' },
  'bacterial-leaf-spot': { multiplier: 0.5, reason: 'Bacterial diseases spread via water splash — switch to drip and reduce volume.' },
  'root-rot':            { multiplier: 0.3, reason: 'Root rot is caused by waterlogging — drastically reduce irrigation and improve drainage.' },
  'leaf-rust':           { multiplier: 0.8, reason: 'Rust spreads on leaf surfaces — keep foliage dry by using drip irrigation.' },
  'nitrogen-deficiency': { multiplier: 1.1, reason: 'Moderate irrigation boost helps nitrogen uptake — consider fertigation.' },
  'healthy':             { multiplier: 1.0, reason: 'No disease modifier — maintain optimal irrigation schedule.' },
};

router.post('/', async (req, res) => {
  try {
    const {
      crop_type = 'default',
      growth_stage = 'vegetative',
      soil_moisture_percent = 40,  // 0-100
      soil_type = 'default',
      temperature_c = 25,
      humidity_percent = 60,
      rain_forecast_mm = 0,        // expected rain in next 24h
      field_area_bigha = 1,
      last_irrigated_days_ago = 2,
      detected_disease = null,     // slug from /api/detect
    } = req.body;

    // ── Reference evapotranspiration (simplified Hargreaves-like) ────────────
    // ETo mm/day based on temperature
    const eto = Math.max(1, (0.0023 * (temperature_c + 17.8) * Math.sqrt(Math.abs(temperature_c - 10))) * 5);

    // ── Crop coefficient ─────────────────────────────────────────────────────
    const profile = CROP_PROFILES[crop_type.toLowerCase()] || CROP_PROFILES.default;
    const kc = profile.stages[growth_stage.toLowerCase()] || profile.stages.vegetative;
    const etc = eto * kc; // crop evapotranspiration mm/day

    // ── Soil water deficit ───────────────────────────────────────────────────
    const whc = SOIL_WHC[soil_type.toLowerCase()] || SOIL_WHC.default;
    const root_depth = profile.root_depth_cm;
    const total_capacity_mm = whc * root_depth;
    const current_water_mm = (soil_moisture_percent / 100) * total_capacity_mm;
    const field_capacity_mm = total_capacity_mm * 0.85; // FC at 85% of max
    const deficit_mm = Math.max(0, field_capacity_mm - current_water_mm);

    // ── Humidity adjustment ──────────────────────────────────────────────────
    const humidity_factor = humidity_percent > 70 ? 0.85 : humidity_percent < 30 ? 1.15 : 1.0;

    // ── Disease modifier ─────────────────────────────────────────────────────
    const diseaseMod = detected_disease && DISEASE_MODIFIERS[detected_disease]
      ? DISEASE_MODIFIERS[detected_disease]
      : DISEASE_MODIFIERS.healthy;

    // ── Days until next irrigation needed ────────────────────────────────────
    const daily_depletion = etc * humidity_factor;
    const allowable_depletion = field_capacity_mm * 0.45; // 45% management allowed depletion
    const days_until_needed = daily_depletion > 0
      ? Math.max(0, ((current_water_mm - (field_capacity_mm - allowable_depletion)) / daily_depletion))
      : 7;

    // ── Rain adjustment ──────────────────────────────────────────────────────
    const effective_rain = rain_forecast_mm * 0.8; // 80% effectiveness
    const rain_adjusted_deficit = Math.max(0, deficit_mm - effective_rain);

    // ── Recommended volume (litres per bigha) ────────────────────────────────
    // 1 bigha ≈ 6772 m². 1mm of water = 1 litre/m²
    const BIGHA_M2 = 6772;
    const base_litres = rain_adjusted_deficit * BIGHA_M2 * field_area_bigha;
    const recommended_litres = Math.round(base_litres * diseaseMod.multiplier);

    // ── Should irrigate? ─────────────────────────────────────────────────────
    const should_irrigate =
      rain_adjusted_deficit > 5 &&
      soil_moisture_percent < 60 &&
      days_until_needed <= 1 &&
      rain_forecast_mm < 10;

    // ── Water savings estimate ───────────────────────────────────────────────
    const baseline_litres = Math.round(rain_adjusted_deficit * BIGHA_M2 * field_area_bigha); // without disease modifier
    const savings_litres = Math.max(0, baseline_litres - recommended_litres);
    const savings_percent = baseline_litres > 0 ? Math.round((savings_litres / baseline_litres) * 100) : 0;

    // ── Irrigation method recommendation ─────────────────────────────────────
    let method = 'drip';
    if (detected_disease && ['late-blight', 'bacterial-leaf-spot'].includes(detected_disease)) {
      method = 'drip_only'; // never overhead
    } else if (rain_forecast_mm > 15) {
      method = 'skip'; // rely on rain
    } else if (soil_moisture_percent > 70) {
      method = 'skip';
    }

    // ── Action message ────────────────────────────────────────────────────────
    let action_message;
    const irrigate_in_hours = Math.round(days_until_needed * 24);
    if (method === 'skip' || rain_forecast_mm > 15) {
      action_message = `Skip irrigation. ${rain_forecast_mm > 15 ? `Rain of ${rain_forecast_mm}mm expected — rely on natural rainfall.` : 'Soil moisture is adequate.'}`;
    } else if (should_irrigate) {
      action_message = `Irrigate now. Apply ${recommended_litres.toLocaleString()}L per ${field_area_bigha} bigha using drip irrigation.`;
    } else {
      action_message = `Next irrigation in ~${irrigate_in_hours} hours. Monitor soil moisture sensor readings.`;
    }

    // ── Risk of over/under watering ───────────────────────────────────────────
    let water_risk = 'low';
    if (soil_moisture_percent > 80) water_risk = 'high_overwatering';
    else if (soil_moisture_percent < 20 && days_until_needed > 2) water_risk = 'high_underwatering';
    else if (soil_moisture_percent > 65 || rain_forecast_mm > 5) water_risk = 'moderate';

    return res.json({
      success: true,
      recommendation: {
        should_irrigate,
        action_message,
        recommended_litres,
        method,
        irrigate_in_hours: should_irrigate ? 0 : irrigate_in_hours,
        rain_forecast_mm,
        effective_rain_mm: Math.round(effective_rain),
        disease_modifier: diseaseMod,
      },
      calculations: {
        etc_mm_per_day: Math.round(etc * 100) / 100,
        soil_deficit_mm: Math.round(deficit_mm),
        days_until_stress: Math.round(days_until_needed * 10) / 10,
        water_risk,
      },
      savings: {
        baseline_litres,
        recommended_litres,
        savings_litres,
        savings_percent,
      },
      inputs_received: {
        crop_type,
        growth_stage,
        soil_moisture_percent,
        soil_type,
        temperature_c,
        humidity_percent,
        rain_forecast_mm,
        field_area_bigha,
        detected_disease,
      },
    });
  } catch (err) {
    console.error('[irrigation] Error:', err);
    return res.status(500).json({ error: 'Failed to calculate irrigation recommendation.' });
  }
});

module.exports = router;
