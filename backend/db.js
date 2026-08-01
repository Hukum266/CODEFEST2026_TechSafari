/**
 * db.js — Pure JSON file-based data store (no native dependencies)
 * 
 * Replaces SQLite with a simple JSON file database that works on any
 * Node.js installation without Python or C++ build tools.
 * 
 * Data is persisted to backend/data/*.json files.
 * All reads/writes are synchronous for simplicity.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ─── JSON file helpers ───────────────────────────────────────────────────────

function readTable(name) {
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

function writeTable(name, data) {
  const file = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function nextId(table) {
  const rows = readTable(table);
  if (!rows.length) return 1;
  return Math.max(...rows.map(r => r.id || 0)) + 1;
}

// ─── Public db API (mirrors better-sqlite3 patterns) ────────────────────────

const db = {
  // ── Generic helpers ────────────────────────────────────────────────────────

  all(table) {
    return readTable(table);
  },

  find(table, predicate) {
    return readTable(table).filter(predicate);
  },

  findOne(table, predicate) {
    return readTable(table).find(predicate) || null;
  },

  insert(table, record) {
    const rows = readTable(table);
    const newRecord = {
      id: nextId(table),
      created_at: new Date().toISOString(),
      ...record,
    };
    rows.push(newRecord);
    writeTable(table, rows);
    return newRecord;
  },

  insertRaw(table, record) {
    // Insert without auto-id (for records that have their own id, e.g. orders)
    const rows = readTable(table);
    const newRecord = { created_at: new Date().toISOString(), ...record };
    rows.push(newRecord);
    writeTable(table, rows);
    return newRecord;
  },

  update(table, predicate, updates) {
    const rows = readTable(table);
    let changed = 0;
    const updated = rows.map(r => {
      if (predicate(r)) { changed++; return { ...r, ...updates }; }
      return r;
    });
    writeTable(table, updated);
    return changed;
  },

  count(table, predicate) {
    const rows = readTable(table);
    return predicate ? rows.filter(predicate).length : rows.length;
  },
};

// ─── Seed products ───────────────────────────────────────────────────────────

function seedProducts() {
  if (readTable('products').length > 0) return;

  const products = [
    { name: 'Copper Fungicide Spray', category: 'treatment', price: 850, unit: 'bottle', description: 'Highly effective broad-spectrum fungicide. Treats powdery mildew, leaf blights, and downy mildew. Copper-based formula approved for organic use.', image: 'images/copper_Fungicide.jpg', stock: 80 },
    { name: 'Neem-Based Treatment', category: 'treatment', price: 620, unit: 'bottle', description: 'Cold-pressed neem oil concentrate. Controls early-stage pest infestations, powdery mildew, and aphids. Chemical-free and safe for pollinators.', image: 'images/Neem Oli.jpg', stock: 150 },
    { name: 'Chlorantraniliprole Insecticide', category: 'treatment', price: 1200, unit: 'bottle', description: 'Systemic insecticide targeting stem borers, leaf folders, and thrips. Long-lasting residual activity up to 3 weeks.', image: 'images/Chlorantraniliprole.jpeg', stock: 60 },
    { name: 'Sulfur Dust (Wettable)', category: 'treatment', price: 480, unit: 'kg', description: 'Wettable sulfur powder for powdery mildew and rust diseases. Can be used as both spray and dust.', image: 'images/copper_Fungicide.jpg', stock: 200 },
    { name: 'Mancozeb Fungicide', category: 'treatment', price: 560, unit: 'packet', description: 'Contact fungicide with multi-site action against early blight, late blight, and anthracnose.', image: 'images/copper_Fungicide.jpg', stock: 120 },
    { name: 'Trichoderma Bio-Fungicide', category: 'treatment', price: 750, unit: 'packet', description: 'Biological soil treatment using beneficial Trichoderma fungi. Prevents root rot, damping-off, and fusarium wilt.', image: 'images/Neem Oli.jpg', stock: 90 },
    { name: 'Soil Moisture Sensor', category: 'sensor', price: 2400, unit: 'piece', description: 'Capacitive soil moisture sensor with digital readout. Connects to irrigation system. IP67 waterproof.', image: 'images/soil_moisture.jpg', stock: 40 },
    { name: 'Drip Irrigation Kit', category: 'equipment', price: 6200, unit: 'kit', description: 'Complete drip irrigation setup for 1 bigha. Includes mainline, lateral pipes, drippers, filters, and fittings.', image: 'images/drip_irigation_kit.jpg', stock: 25 },
    { name: 'Potassium Fertilizer (SOP)', category: 'treatment', price: 890, unit: 'kg', description: 'Sulfate of Potash for improving fruit quality, disease resistance, and drought tolerance. Low chloride.', image: 'images/copper_Fungicide.jpg', stock: 300 },
    { name: 'Calcium Boron Spray', category: 'treatment', price: 420, unit: 'bottle', description: 'Foliar spray for calcium and boron deficiency. Prevents blossom end rot and tip burn.', image: 'images/Neem Oli.jpg', stock: 110 },
  ];

  const rows = products.map((p, i) => ({ id: i + 1, created_at: new Date().toISOString(), ...p }));
  writeTable('products', rows);
  console.log(`[DB] Seeded ${rows.length} products`);
}

// ─── Seed diseases ───────────────────────────────────────────────────────────

function seedDiseases() {
  if (readTable('diseases').length > 0) return;

  const diseases = [
    {
      id: 1, name: 'Powdery Mildew', slug: 'powdery-mildew',
      description: 'A fungal disease causing white, powdery fungal growth on leaf surfaces.',
      cause: 'Fungus Erysiphe spp. Thrives in warm, dry weather with high humidity.',
      symptoms: 'White or grey powdery spots on leaves and stems. Affected leaves curl, yellow, and drop.',
      severity_map: { early: 'Small isolated white patches. Easily treatable.', moderate: 'Multiple leaves affected. Treatment required within 48 hours.', advanced: 'Widespread white coating. Yield loss likely. Aggressive treatment needed.' },
      irrigation_advice: 'REDUCE irrigation frequency. Water in the morning only. Avoid overhead watering. High humidity promotes spread.',
      product_ids: [1, 4, 2], // Copper Fungicide, Sulfur Dust, Neem
    },
    {
      id: 2, name: 'Early Blight', slug: 'early-blight',
      description: 'Fungal disease causing dark, target-like spots with yellow halos on lower leaves first.',
      cause: 'Fungus Alternaria solani. Warm temperatures (24–29°C) and wet conditions.',
      symptoms: 'Dark brown circular spots with concentric rings resembling a target. Yellow halo around spots.',
      severity_map: { early: 'Small dark spots on lower leaves only. Remove affected leaves and apply fungicide.', moderate: 'Spots on multiple leaf layers. Defoliation starting. Apply systemic fungicide.', advanced: 'Severe defoliation, stem lesions. Yield heavily compromised.' },
      irrigation_advice: 'Use drip irrigation to keep foliage dry. Water in early morning. Ensure good air circulation.',
      product_ids: [5, 1, 6], // Mancozeb, Copper Fungicide, Trichoderma
    },
    {
      id: 3, name: 'Late Blight', slug: 'late-blight',
      description: 'Devastating water mold that can destroy crops within days.',
      cause: 'Oomycete Phytophthora infestans. Cool, moist conditions (10–25°C with rain or heavy dew).',
      symptoms: 'Water-soaked, dark green to brown lesions that expand rapidly. White mold on underside in humid conditions.',
      severity_map: { early: 'Small water-soaked spots. Act immediately — spreads within 24–48 hours.', moderate: 'Large brown lesions. Remove and destroy infected material.', advanced: 'Entire plants collapsing. Immediate action essential.' },
      irrigation_advice: 'STOP overhead irrigation immediately. Switch to drip/furrow irrigation. Improve drainage. Do not water in cloudy/cool weather.',
      product_ids: [1, 5], // Copper Fungicide, Mancozeb
    },
    {
      id: 4, name: 'Leaf Rust', slug: 'leaf-rust',
      description: 'Fungal disease causing orange-brown rust pustules on leaf undersides.',
      cause: 'Various Puccinia species. Wind-borne spores. Moderate temperatures and dew.',
      symptoms: 'Orange, brown, or yellow pustules on lower leaf surfaces. Upper surface shows yellow flecks.',
      severity_map: { early: 'Scattered pustules. Fungicide application effective.', moderate: 'Pustules on many leaves. Increase spray frequency.', advanced: 'Heavy pustulation, leaves dying. Significant yield loss.' },
      irrigation_advice: 'Maintain moderate irrigation. Avoid leaf wetness — use drip. Water in morning so leaves dry quickly.',
      product_ids: [4, 5], // Sulfur Dust, Mancozeb
    },
    {
      id: 5, name: 'Bacterial Leaf Spot', slug: 'bacterial-leaf-spot',
      description: 'Water-soaked lesions that turn dark brown, often with a yellow halo.',
      cause: 'Various Xanthomonas and Pseudomonas species. Spreads via rain splash and infected tools.',
      symptoms: 'Water-soaked spots that become brown with yellow margins. Lesions may merge.',
      severity_map: { early: 'Small isolated spots. Remove affected leaves. Apply copper spray.', moderate: 'Multiple spots per leaf. Systemic copper treatment needed.', advanced: 'Large necrotic areas. Significant defoliation.' },
      irrigation_advice: 'Avoid overhead irrigation — spreads bacterial infection. Use drip. Do not work in field when plants are wet.',
      product_ids: [1, 2], // Copper Fungicide, Neem
    },
    {
      id: 6, name: 'Root Rot', slug: 'root-rot',
      description: 'Soil-borne disease causing root decay. Often caused by overwatering.',
      cause: 'Pythium, Phytophthora, Fusarium, or Rhizoctonia. Triggered by waterlogged soils.',
      symptoms: 'Yellowing and wilting despite adequate water. Brown, mushy roots. Plant stunting.',
      severity_map: { early: 'Some yellowing, roots slightly discoloured. Improve drainage immediately.', moderate: 'Significant wilting, brown roots visible. Apply biological fungicide.', advanced: 'Plants collapsing. Root system largely destroyed.' },
      irrigation_advice: 'SIGNIFICANTLY reduce irrigation. Allow soil to dry between waterings. Improve drainage. Never water in evenings.',
      product_ids: [6, 7, 8], // Trichoderma, Soil Moisture Sensor, Drip Kit
    },
    {
      id: 7, name: 'Nitrogen Deficiency', slug: 'nitrogen-deficiency',
      description: 'Nutrient deficiency causing uniform yellowing of older leaves first.',
      cause: 'Insufficient nitrogen in soil. Worsened by waterlogging or sandy soils.',
      symptoms: 'Pale green to yellow colour starting from older/lower leaves. Leaves turn fully yellow and drop.',
      severity_map: { early: 'Slight yellowing on lower leaves. Apply nitrogen fertilizer.', moderate: 'Widespread yellowing. Urgent fertilizer application needed.', advanced: 'Stunted growth, severe yellowing, reduced flowering.' },
      irrigation_advice: 'Moderate, consistent irrigation improves nitrogen uptake. Avoid waterlogging. Fertigation is highly effective.',
      product_ids: [9, 10, 8], // Potassium Fertilizer, Calcium Boron, Drip Kit
    },
    {
      id: 8, name: 'Healthy Plant', slug: 'healthy',
      description: 'No disease detected. The plant appears healthy.',
      cause: 'N/A',
      symptoms: 'Normal green leaf colour, no spots, no powdery growth, no yellowing or wilting.',
      severity_map: { early: 'Healthy — no action required.', moderate: 'Healthy — continue current practices.', advanced: 'Healthy — monitor regularly.' },
      irrigation_advice: 'Continue current irrigation schedule. Monitor soil moisture regularly.',
      product_ids: [7, 2], // Soil Moisture Sensor, Neem (preventive)
    },
  ].map(d => ({ created_at: new Date().toISOString(), ...d }));

  writeTable('diseases', diseases);
  console.log(`[DB] Seeded ${diseases.length} diseases`);
}

// ─── Seed produce listings ───────────────────────────────────────────────────

function seedProduce() {
  if (readTable('produce_listings').length > 0) return;

  const listings = [
    { farmer_name: 'Ram Bhandari', farm_name: 'Bhandari Farm', crop_name: 'Tomatoes', price: 120, unit: 'kg', quantity: 500, description: 'Fresh, vine-ripened tomatoes. Zero fungicide treatments this season. Grown using AgriGuardian-optimised irrigation.', image: 'images/tomatoes1.jpg', certifications: ['AgriGuardian Verified', 'Chemical-Free'], disease_free: 1, irrigation_optimized: 1, status: 'active' },
    { farmer_name: 'Sita Sharma', farm_name: 'Greenfield Farm', crop_name: 'Spinach', price: 60, unit: 'bundle', quantity: 200, description: 'Freshly harvested spinach from organic soil. Rich in iron. No pesticide use.', image: 'images/spinach1.jpg', certifications: ['Organic', 'AgriGuardian Verified'], disease_free: 1, irrigation_optimized: 0, status: 'active' },
    { farmer_name: 'Hari Rai', farm_name: 'Rai Family Farm', crop_name: 'Sweet Corn', price: 90, unit: 'kg', quantity: 800, description: 'Non-GMO sweet corn. Drip-irrigated for optimal sweetness. Water usage reduced 22% vs baseline.', image: 'images/sweet_corn.jpg', certifications: ['Non-GMO', 'Water-Smart'], disease_free: 1, irrigation_optimized: 1, status: 'active' },
    { farmer_name: 'Mohan Thapa', farm_name: 'Ghorahi Organic Farm', crop_name: 'Paddy Rice', price: 40, unit: 'kg', quantity: 2000, description: 'Traditional Ruway paddy variety. Grown in organic soil without synthetic chemicals.', image: 'images/rice.jpg', certifications: ['Organic'], disease_free: 1, irrigation_optimized: 0, status: 'active' },
    { farmer_name: 'Kamala Oli', farm_name: 'Dang Fresh Agro Farm', crop_name: 'Potato', price: 60, unit: 'kg', quantity: 3000, description: 'Hill-grown potato varieties. Disease-free certified by AgriGuardian AI scan.', image: 'images/potato.webp', certifications: ['AgriGuardian Verified', 'Disease-Free Certified'], disease_free: 1, irrigation_optimized: 1, status: 'active' },
    { farmer_name: 'Bishnu Karki', farm_name: 'Green Harvest Nepal', crop_name: 'Onion', price: 45, unit: 'kg', quantity: 1500, description: 'Dry onions, fully cured. Long shelf life. Grown in well-drained soil with managed irrigation.', image: 'images/onion.jpg', certifications: ['AgriGuardian Verified'], disease_free: 1, irrigation_optimized: 0, status: 'active' },
    { farmer_name: 'Prem Gurung', farm_name: 'Shree Krishna Agriculture Farm', crop_name: 'Cucumber', price: 70, unit: 'kg', quantity: 400, description: 'Crisp, fresh cucumbers. Trellis-grown for uniform shape. Minimum 3 AI health scans per week.', image: 'images/cucumber.webp', certifications: ['AgriGuardian Verified', 'Trellis-Grown'], disease_free: 1, irrigation_optimized: 1, status: 'active' },
  ].map((p, i) => ({ id: i + 1, created_at: new Date().toISOString(), ...p }));

  writeTable('produce_listings', listings);
  console.log(`[DB] Seeded ${listings.length} produce listings`);
}

// ─── Run seeders ─────────────────────────────────────────────────────────────

seedProducts();
seedDiseases();
seedProduce();

// ─── Convenience query helpers used by routes ────────────────────────────────

db.getProductsByCategory = (category) => {
  if (!category || category === 'all') return readTable('products');
  return readTable('products').filter(p => p.category === category);
};

db.getProductById = (id) => {
  return readTable('products').find(p => p.id === parseInt(id)) || null;
};

db.getDiseaseBySlug = (slug) => {
  return readTable('diseases').find(d => d.slug === slug) || null;
};

db.getDiseaseByName = (name) => {
  return readTable('diseases').find(d => d.name.toLowerCase() === name.toLowerCase()) || null;
};

db.getTreatmentProducts = (disease) => {
  if (!disease || !disease.product_ids) return [];
  const products = readTable('products');
  return disease.product_ids.map((pid, idx) => {
    const p = products.find(pr => pr.id === pid);
    if (!p) return null;
    // Build treatment note from disease context
    const notes = {
      1: 'Primary treatment — apply every 7 days until symptoms clear.',
      2: 'Alternating this with primary treatment builds better resistance management.',
      3: 'Preventive and early-stage control.',
    };
    return { ...p, priority: idx + 1, treatment_note: notes[idx + 1] || 'Recommended for this condition.' };
  }).filter(Boolean);
};

db.getActiveListings = (search = '') => {
  let listings = readTable('produce_listings').filter(l => l.status === 'active');
  if (search) {
    const q = search.toLowerCase();
    listings = listings.filter(l =>
      l.crop_name.toLowerCase().includes(q) ||
      l.farm_name.toLowerCase().includes(q) ||
      l.farmer_name.toLowerCase().includes(q)
    );
  }
  return listings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

db.addScanHistory = (record) => {
  return db.insert('scan_history', record);
};

db.getRecentScans = (limit = 10) => {
  const scans = readTable('scan_history');
  return scans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, limit);
};

db.addOrder = (order) => {
  return db.insertRaw('orders', order);
};

db.getOrderById = (id) => {
  return readTable('orders').find(o => o.id === id) || null;
};

module.exports = db;
