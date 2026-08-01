# AgriGuardian AI

An AI-powered farm assistant that detects plant diseases and optimizes irrigation.

## Quick Start

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
# Copy the example env file
copy .env.example .env
```

Open `backend/.env` and add your Gemini API key:
```
GEMINI_API_KEY= Your_api_key_here
```

Get a free key at: https://aistudio.google.com/app/apikey

> Without a key the app runs in **demo mode** — all features work with realistic simulated AI results.

### 3. Start the backend server

```bash
cd backend
npm start
```

Server runs at `http://localhost:3001`

### 4. Open the frontend

Open `index.html` in your browser via a local server (e.g. VS Code Live Server on port 5500), or simply double-click it.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/detect` | AI disease detection (multipart image upload) |
| `POST` | `/api/irrigation` | Smart irrigation recommendation |
| `GET` | `/api/dashboard` | Farm health dashboard data |
| `GET` | `/api/products` | List shop products |
| `GET` | `/api/products/:id` | Single product detail |
| `GET` | `/api/produce` | List farmer produce listings |
| `POST` | `/api/produce` | Create a new produce listing (farmer sell) |
| `POST` | `/api/orders` | Place an order (checkout) |
| `GET` | `/api/orders/:id` | Get order by ID |
| `GET` | `/api/weather/:city` | 7-day weather forecast + irrigation advisory |
| `GET` | `/api/analytics` | Predictive risk analytics |
| `GET` | `/api/health` | Server health check |

---

## Project Structure

```
CODEFEST2026_TechSafari/
├── index.html          # Landing page (live dashboard)
├── diseases.html       # AI disease detection scanner
├── farmer.html         # Farmers shop + sell produce form
├── consumer.html       # Consumer produce marketplace
├── cart.html           # Shopping cart + checkout
├── irrigation.html     # Smart irrigation advisor
├── css/style.css       # Custom CSS (animations etc.)
├── js/custom.js        # Shared cart logic + API helpers
├── images/             # Product and produce images
└── backend/
    ├── server.js       # Express app entry point
    ├── db.js           # SQLite database + seeding
    ├── .env.example    # Environment variables template
    ├── .env            # Your secrets (create from example)
    ├── package.json
    └── routes/
        ├── detect.js       # POST /api/detect
        ├── irrigation.js   # POST /api/irrigation
        ├── dashboard.js    # GET  /api/dashboard
        ├── products.js     # /api/products + /api/produce
        ├── orders.js       # /api/orders
        ├── weather.js      # GET  /api/weather/:city
        └── analytics.js    # GET  /api/analytics
```

---

## Disease Detection Flow

1. Farmer uploads a leaf photo on `diseases.html`
2. Image sent to `POST /api/detect` as multipart form
3. Backend sends image to Gemini Vision API with a structured prompt
4. AI returns disease name, confidence, severity, symptoms, and treatment advice
5. Backend matches the disease to products in the SQLite database
6. Frontend displays full diagnosis + recommended treatment products
7. Farmer can add treatments to cart and buy from the shop
8. Detected disease slug is passed to `irrigation.html` for disease-aware irrigation advice

## Irrigation Advisor Flow

1. Farmer fills in crop type, growth stage, soil moisture, temperature, humidity
2. Optionally uses "Fetch Weather" to auto-fill from Open-Meteo API (free, no key)
3. Detected disease from scanner auto-fills disease modifier
4. `POST /api/irrigation` calculates crop evapotranspiration + soil water deficit
5. Disease modifier adjusts recommended volume (e.g. powdery mildew → reduce by 40%)
6. Returns: should irrigate, volume in litres, method, timing, and water savings vs baseline

## Farmer Marketplace Flow

1. Farmer clicks "Sell Your Produce" on `farmer.html`
2. Fills in form: crop, price, quantity, farm name, certifications
3. `POST /api/produce` saves the listing to SQLite
4. Listing appears immediately on `consumer.html` dynamically

## Technology Stack

- **Frontend**: HTML5 + Tailwind CSS + Vanilla JS
- **Backend**: Node.js + Express
- **Database**: SQLite (via better-sqlite3, zero configuration)
- **AI**: Google Gemini Vision API (gemini-1.5-flash)
- **Weather**: Open-Meteo free API (no key required)
- **Auth**: None (prototype — add Firebase Auth for production)
