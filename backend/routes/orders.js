/**
 * POST /api/orders     — place a new order (checkout)
 * GET  /api/orders/:id — fetch an order by ID
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

// ── POST /api/orders ─────────────────────────────────────────────────────────
router.post('/', (req, res) => {
  try {
    const { items, delivery_address, contact_name, contact_phone } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }
    for (const item of items) {
      if (!item.name || typeof item.price !== 'number') {
        return res.status(400).json({ error: 'Each item requires a name and numeric price.' });
      }
    }

    const subtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shipping = subtotal > 2000 ? 0 : 50;
    const total = subtotal + shipping;
    const orderId = uuidv4();

    const order = db.addOrder({
      id: orderId,
      items,
      subtotal,
      shipping,
      total,
      status: 'confirmed',
      contact_name: contact_name || '',
      contact_phone: contact_phone || '',
      delivery_address: delivery_address || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order: { ...order, estimated_delivery: '2-3 business days' },
    });
  } catch (err) {
    console.error('[orders POST] Error:', err);
    return res.status(500).json({ error: 'Failed to place order.' });
  }
});

// ── GET /api/orders/:id ──────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    return res.json({ success: true, order });
  } catch (err) {
    console.error('[orders GET] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch order.' });
  }
});

module.exports = router;
