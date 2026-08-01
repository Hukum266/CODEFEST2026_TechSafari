/**
 * GET  /api/products           — list all products (with optional ?category= filter)
 * GET  /api/products/:id       — single product with disease links
 * GET  /api/produce            — list all farmer produce listings (with ?search=)
 * POST /api/produce            — farmer submits a new produce listing
 * PUT  /api/produce/:id/status — update listing status
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

// ── GET /api/products ────────────────────────────────────────────────────────
router.get('/products', (req, res) => {
  try {
    const { category, search } = req.query;
    let products = db.getProductsByCategory(category);

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, products });
  } catch (err) {
    console.error('[products] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// ── GET /api/products/:id ────────────────────────────────────────────────────
router.get('/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    // Find diseases this product treats
    const diseases = db.all('diseases').filter(d =>
      d.product_ids && d.product_ids.includes(product.id)
    ).map(d => ({ name: d.name, slug: d.slug }));

    return res.json({ success: true, product, treats_diseases: diseases });
  } catch (err) {
    console.error('[products/:id] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

// ── GET /api/produce ─────────────────────────────────────────────────────────
router.get('/produce', (req, res) => {
  try {
    const { search } = req.query;
    const listings = db.getActiveListings(search || '');
    return res.json({ success: true, listings });
  } catch (err) {
    console.error('[produce] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch produce listings.' });
  }
});

// ── POST /api/produce ────────────────────────────────────────────────────────
router.post('/produce', (req, res) => {
  try {
    const { farmer_name, farm_name, crop_name, price, unit = 'kg', quantity,
            description, image, certifications = [], disease_free = 1, irrigation_optimized = 0 } = req.body;

    if (!farmer_name || !farm_name || !crop_name || !price || !quantity) {
      return res.status(400).json({
        error: 'Required fields missing: farmer_name, farm_name, crop_name, price, quantity',
      });
    }
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number.' });
    }

    const newListing = db.insert('produce_listings', {
      farmer_name: farmer_name.trim(),
      farm_name: farm_name.trim(),
      crop_name: crop_name.trim(),
      price: parseInt(price),
      unit: unit.trim(),
      quantity: parseInt(quantity),
      description: (description || '').trim(),
      image: image || '',
      certifications: Array.isArray(certifications) ? certifications : [],
      disease_free: disease_free ? 1 : 0,
      irrigation_optimized: irrigation_optimized ? 1 : 0,
      status: 'active',
    });

    return res.status(201).json({
      success: true,
      message: 'Produce listing created successfully.',
      listing: newListing,
    });
  } catch (err) {
    console.error('[produce POST] Error:', err);
    return res.status(500).json({ error: 'Failed to create produce listing.' });
  }
});

// ── PUT /api/produce/:id/status ──────────────────────────────────────────────
router.put('/produce/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['active', 'sold_out', 'pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }
    const id = parseInt(req.params.id);
    const changed = db.update('produce_listings', r => r.id === id, { status });
    if (!changed) return res.status(404).json({ error: 'Listing not found.' });
    return res.json({ success: true, message: `Listing status updated to '${status}'.` });
  } catch (err) {
    console.error('[produce status] Error:', err);
    return res.status(500).json({ error: 'Failed to update listing status.' });
  }
});

module.exports = router;
