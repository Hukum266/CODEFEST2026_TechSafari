/**
 * i18n.js — AgriGuardian AI  (English / Nepali)
 * 1. IIFE: apply saved lang before paint
 * 2. TRANSLATIONS object
 * 3. Engine: t(), applyTranslations(), toggleLanguage()
 * 4. DOMContentLoaded: inject button + apply
 */
(function () {
  var l = localStorage.getItem('agri-lang') || 'en';
  document.documentElement.setAttribute('lang', l === 'ne' ? 'ne' : 'en');
}());

const TRANSLATIONS = {
en: {
  /* ── NAV ── */
  nav_home:'Home', nav_farmers_shop:'Farmers Shop', nav_consumer_shop:'Consumer Shop',
  nav_disease:'Disease Detection', nav_irrigation:'Irrigation', nav_try_scan:'Try a scan',
  /* ── SHARED ── */
  add_to_cart:'Add to cart', retry:'Retry', cancel:'Cancel', view_all:'View all',
  in_stock:'In stock', out_of_stock:'Out of stock', low_stock_suffix:'left',
  /* ── FOOTER ── */
  footer_tagline:'Detects plant disease before it spreads, and waters only when the field needs it.',
  footer_concept:'Concept product — not a live agronomy or e-commerce service.',
  /* ── INDEX hero ── */
  hero_tag:'Computer vision · Irrigation intelligence · Precision agriculture',
  hero_h1_line1:'The leaf shows it first.',
  hero_h1_line2:'Now you see it first too.',
  hero_desc:'AgriGuardian AI reads a photo of a leaf the way an agronomist would — naming the disease, scoring confidence, and marking exactly where the damage sits. Then it feeds that finding into your irrigation schedule, so watering never makes an outbreak worse.',
  hero_cta_how:'See how it works', hero_cta_shop:'Visit Farmers Shop',
  hero_stat_engines:'core engines', hero_stat_inputs:'environmental inputs',
  hero_stat_loop:'shared decision loop',
  hero_scan_note:'Affected area outlined automatically — no manual cropping needed.',
  /* ── INDEX mission ── */
  mission_title:'Our mission',
  mission_desc:"AgriGuardian AI exists to close two gaps at once — the gap between noticing a problem and knowing what to do about it, and the gap between a healthy harvest and the people who eat it.",
  mission_c1_title:'Protect the crop', mission_c1_desc:"Catch disease while it's still cheap to treat.",
  mission_c2_title:'Conserve the water', mission_c2_desc:'Irrigate on evidence, not habit or guesswork.',
  mission_c3_title:'Connect the harvest', mission_c3_desc:'Let the people eating it see how it was grown.',
  /* ── INDEX problem ── */
  problem_title:'The problem',
  problem_desc:'A yellowing leaf could mean disease, a nutrient deficiency, or a watering problem. Farmers rarely get a clean signal, and every day spent guessing is a day the problem gets worse.',
  problem_1_title:'Disease or deficiency?',
  problem_1_desc:"The same discoloration can point to a fungus or a missing nutrient — and the treatments don't overlap.",
  problem_2_title:'Too much or too little water?',
  problem_2_desc:'Irrigation decisions are often made on habit, not on soil moisture, forecast, or growth stage.',
  problem_3_title:"By the time it's visible, it's spreading.",
  problem_3_desc:'Most outbreaks are already established in the surrounding crop before the first symptom is caught.',
},
ne: {
  /* ── NAV ── */
  nav_home:'गृहपृष्ठ', nav_farmers_shop:'किसान पसल', nav_consumer_shop:'उपभोक्ता पसल',
  nav_disease:'रोग पहिचान', nav_irrigation:'सिँचाइ', nav_try_scan:'स्क्यान गर्नुहोस्',
  /* ── SHARED ── */
  add_to_cart:'कार्टमा थप्नुहोस्', retry:'पुनः प्रयास', cancel:'रद्द गर्नुहोस्',
  view_all:'सबै हेर्नुहोस्', in_stock:'स्टकमा छ', out_of_stock:'स्टक सकियो',
  low_stock_suffix:'बाँकी',
  /* ── FOOTER ── */
  footer_tagline:'रोग फैलिनुअघि पत्ता लगाउँछ, र खेतलाई साँच्चै चाहिएको बेलामात्र पानी दिन्छ।',
  footer_concept:'अवधारणा उत्पादन — लाइभ कृषि वा इ-कमर्स सेवा होइन।',
  /* ── INDEX hero ── */
  hero_tag:'कम्प्युटर दृष्टि · सिँचाइ बुद्धिमत्ता · परिशुद्ध कृषि',
  hero_h1_line1:'पात पहिले देखाउँछ।',
  hero_h1_line2:'अब तपाईंले पनि पहिले देख्नुहुन्छ।',
  hero_desc:'AgriGuardian AI ले एक कृषि विज्ञसरी पातको फोटो पढ्छ — रोगको नाम दिन्छ, विश्वास स्कोर दिन्छ, र क्षतिको ठीक स्थान चिन्हित गर्छ। त्यसपछि यो नतिजा तपाईंको सिँचाइ तालिकामा सिधै पठाइन्छ।',
  hero_cta_how:'कसरी काम गर्छ हेर्नुहोस्', hero_cta_shop:'किसान पसल भ्रमण गर्नुहोस्',
  hero_stat_engines:'मुख्य इन्जिन', hero_stat_inputs:'वातावरणीय इनपुट',
  hero_stat_loop:'साझा निर्णय लूप',
  hero_scan_note:'प्रभावित क्षेत्र स्वतः रेखाङ्कित — हातले काट्नु पर्दैन।',
  /* ── INDEX mission ── */
  mission_title:'हाम्रो लक्ष्य',
  mission_desc:'AgriGuardian AI दुई खाडल एकैसाथ पुर्न बनेको छ — समस्या देख्ने र के गर्ने जान्नेबीचको खाडल, र स्वस्थ फसल र त्यो खाने मान्छेबीचको खाडल।',
  mission_c1_title:'बालीको संरक्षण', mission_c1_desc:'रोग सस्तोमा उपचार गर्न सकिने बेलामै पत्ता लगाउनुहोस्।',
  mission_c2_title:'पानी बचत', mission_c2_desc:'प्रमाणमा आधारित सिँचाइ गर्नुहोस्, आदत वा अनुमानमा होइन।',
  mission_c3_title:'फसल जोड्नुहोस्', mission_c3_desc:'खाने मान्छेलाई कसरी उत्पादन भयो देखाउनुहोस्।',
  /* ── INDEX problem ── */
  problem_title:'समस्या',
  problem_desc:'पहेँलो पात रोग, पोषण कमी वा पानीको समस्या हुन सक्छ। किसानलाई स्पष्ट संकेत कम मिल्छ, र अनुमानमा बिताएको हरेक दिन समस्या झन् ठूलो बनाउँछ।',
  problem_1_title:'रोग कि पोषण कमी?',
  problem_1_desc:'एउटै रंग परिवर्तनले ढुसी वा पोषण कमी देखाउन सक्छ — र दुवैको उपचार फरक हुन्छ।',
  problem_2_title:'धेरै वा कम पानी?',
  problem_2_desc:'सिँचाइ निर्णय प्राय: आदतमा हुन्छ, माटोको आर्द्रता वा मौसम पूर्वानुमानमा होइन।',
  problem_3_title:'देखिने बेलामा, फैलिसकेको हुन्छ।',
  problem_3_desc:'अधिकांश प्रकोप पहिलो लक्षण देखिनु अगावै वरपरको बालीमा फैलिसकेको हुन्छ।',
},
};

// extend with remaining page strings
Object.assign(TRANSLATIONS.en, {
  /* ── INDEX sections ── */
  farmers_shop_title:'Farmers Shop', consumer_shop_title:'Consumers Shop',
  disease_section_title:'Disease Detection',
  ai_detect_title:'AI Disease Detection',
  ai_detect_desc:'Upload a photo of any leaf. The model returns a full read-out, not just a label.',
  detect_f1_title:'Disease identified', detect_f1_desc:'— species-level where possible',
  detect_f2_title:'Confidence score',  detect_f2_desc:'— how sure the model is',
  detect_f3_title:'Severity',          detect_f3_desc:'— early, moderate, or advanced',
  detect_f4_title:'Highlighted regions', detect_f4_desc:'— the exact affected area, outlined',
  detect_f5_title:'Plain-language explanation', detect_f5_desc:'— why the model thinks so',
  detect_f6_title:'Treatment recommendation',  detect_f6_desc:'— what to do next',
  irrigation_advisor_title:'Smart Irrigation Advisor',
  irrigation_advisor_desc:'Combines six live inputs to answer one question: water now, or wait?',
  irrigation_output_label:'Output:',
  irrigation_output_text:'when to irrigate and how much — tuned to save water without under-watering the crop.',
  integrated_title:'Integrated intelligence',
  integrated_desc:"A detection doesn't just sit in a report — it changes what the irrigation advisor recommends next. If the disease engine flags powdery mildew, the irrigation advisor automatically reduces watering frequency.",
  integrated_step1:'Powdery mildew detected',
  integrated_step2:'Irrigation frequency lowered',
  integrated_step3:'Humidity drops, spread risk falls',
  /* ── INDEX dashboard ── */
  dashboard_title:'Farm dashboard',
  dashboard_desc:'Everything the two engines learn gets rolled up into five numbers a farmer can check in ten seconds.',
  db_health_label:'Farm health score', db_risk_label:'Disease risk',
  db_water_label:'Water usage',        db_scans_label:'Scans',
  db_scans_sub:'recent scans logged',  db_action_label:'Recommended action',
  db_products_label:'Recommended products based on recent scans',
  db_run_scan:'Run a new scan to update dashboard',
  db_loading:'Loading...', db_live:'Live data',
  db_offline:'Backend offline — start server for live data',
  /* ── INDEX predictive ── */
  predict_title:'Predictive analytics',
  predict_desc:"Weather and environmental data — humidity trends, leaf-wetness duration, temperature swings — often signal an outbreak days before it's visible on a leaf.",
  predict_chart_label:'Environmental risk index', predict_chart_window:'14-day window',
  predict_chart_note:'Risk climbs well ahead of visible onset — the window where preventive treatment is cheapest.',
  /* ── INDEX beyond ── */
  beyond_title:'Beyond the core',
  feat_satellite_title:'Satellite & drone view',    feat_satellite_desc:'Field-level visualization layered over the same risk data.',
  feat_voice_title:'Multilingual voice assistant',  feat_voice_desc:"Ask questions and get recommendations spoken back in the farmer's own language.",
  feat_offline_title:'Offline mode',               feat_offline_desc:'Detection still runs without signal; results sync once the connection returns.',
  feat_xai_title:'Explainable AI',                 feat_xai_desc:'Every diagnosis comes with the reasoning behind it, not just a label.',
  feat_community_title:'Community disease alerts',  feat_community_desc:'When nearby farms report an outbreak, neighboring fields get an early warning.',
  feat_water_title:'Water-saving analytics',        feat_water_desc:'Track litres saved over time as irrigation gets tuned to real conditions.',
  /* ── INDEX why choose ── */
  why_title:'Why choose AgriGuardian',
  why_desc:'Most tools stop at a label. AgriGuardian AI connects vision, weather, irrigation, and the shop into one loop.',
  why_1:'Detection and irrigation share one decision loop, not two separate apps.',
  why_2:'Predicts outbreaks from environmental trends, before symptoms appear.',
  why_3:'Treatment products are recommended straight from the diagnosis result.',
  why_4:'Farmers can list and sell their produce directly from the platform.',
  /* ── DISEASES page ── */
  diseases_tag:'Instant AI Diagnosis',
  diseases_h1:'See the disease before the leaf shows it.',
  diseases_desc:'Upload a photo of a plant leaf. The AI instantly analyzes the symptoms, identifies the disease, and recommends targeted treatments from our shop.',
  upload_title:'Upload a leaf photo',
  upload_sub:'Supports JPG, PNG, WEBP · Max 10MB',
  upload_powered:'Powered by Gemini Vision AI',
  loading_analyzing:'Analyzing leaf structure...',
  error_title:'Image not recognized',
  error_default:'We could not detect a valid leaf structure. Please upload a clear photo of a plant leaf.',
  try_again:'Try Again',
  results_title:'Scan Results',
  result_affected_label:'Affected Area', result_confidence_label:'Confidence',
  scan_another:'Scan Another Image',
  irrigation_advice_btn:'Irrigation Advice',
  recommended_treatments:'Recommended Treatments',
  from_our_shop:'(from our shop)',
  severity_advice_label:'Severity Advice',
  about_disease_title:'About this Disease',
  cause_label:'Cause', symptoms_label_text:'Symptoms',
  full_irrigation_label:'Full Irrigation Recommendation',
  demo_mode_title:'Demo Mode',
  priority_prefix:'Priority',
  /* ── FARMER page ── */
  farmer_tag:'Treatments · Equipment · Sensors',
  farmer_h1:'Farmers Shop',
  farmer_desc:'Everything you need to treat detected diseases and set up smart irrigation. Products recommended directly after an AI scan.',
  sell_produce_btn:'Sell Your Produce',
  filter_all:'All Products', filter_treatment:'Treatments',
  filter_equipment:'Equipment', filter_sensor:'Sensors',
  products_loading:'Loading products...',
  products_error:'Could not load products. Make sure the backend server is running.',
  sell_modal_title:'List Your Produce',
  field_your_name:'Your Name', field_farm_name:'Farm Name',
  field_crop_name:'Crop Name', field_unit:'Unit',
  field_price:'Price (Rs.)', field_quantity:'Quantity Available',
  field_description:'Description',
  field_photo:'Product Photo', field_photo_optional:'(optional)',
  photo_drop_title:'Click to upload or drag & drop',
  photo_drop_sub:'JPG, PNG, WEBP · Max 5MB',
  photo_tip:'A good photo helps consumers choose your produce.',
  check_disease_free:'Disease-free certified (AI scanned)',
  check_irrigation_opt:'Irrigation-optimized',
  submit_listing:'Submit Listing',
  unit_kg:'per kg', unit_bundle:'per bundle', unit_piece:'per piece',
  unit_dozen:'per dozen', unit_quintal:'per quintal',
  /* ── CONSUMER page ── */
  consumer_tag:'Fresh · Verified · Traceable',
  consumer_h1:'Consumer Shop',
  consumer_desc:'Farm-fresh produce listed directly by local farmers. Every item shows how it was grown.',
  consumer_farmer_cta:'Are you a farmer? List your produce',
  badge_verified:'AgriGuardian Verified', badge_water:'Water-Optimized',
  badge_disease_free_cert:'Disease-Free Certified',
  search_ph:'Search crops, farm names...',
  produce_loading:'Loading produce listings...',
  produce_error:'Could not load produce listings. Make sure the backend server is running.',
  produce_empty:'No produce found matching your search.',
  disease_free_tag:'Disease-Free', water_smart_tag:'Water-Smart',
  /* ── CART page ── */
  cart_title:'Your Cart',
  cart_empty_title:'Your cart is currently empty.',
  cart_empty_sub:'Add products from the shop or recommended treatments after a disease scan.',
  continue_shopping:'Continue shopping', scan_leaf_btn:'Scan a Leaf',
  order_summary:'Order Summary',
  subtotal_label:'Subtotal', delivery_label:'Delivery',
  delivery_free:'Free', total_label:'Total',
  name_ph:'Your name', phone_ph:'Phone number', address_ph:'Delivery address',
  checkout_btn:'Proceed to Checkout',
  free_delivery_note:'Free delivery on orders above Rs. 2,000',
  order_confirmed_title:'Order Confirmed!',
  order_delivery_est:'Estimated delivery: 2-3 business days',
  /* ── IRRIGATION page ── */
  irr_tag:'AI-Powered · Weather-Aware · Disease-Integrated',
  irr_h1:'Smart Irrigation', irr_h1_accent:'Advisor',
  irr_desc:'Enter your field conditions and get an evidence-based irrigation recommendation. The advisor factors in weather forecasts, soil moisture, crop type, growth stage, and any detected disease.',
  irr_form_title:'Field Parameters',
  irr_crop_type:'Crop Type', irr_growth_stage:'Growth Stage',
  irr_soil_moisture:'Soil Moisture', irr_soil_type:'Soil Type',
  irr_area:'Field Area (Bigha)', irr_temp:'Temperature (°C)',
  irr_humidity:'Humidity', irr_rain:'Rain Forecast (mm/24h)',
  irr_last_irr:'Last Irrigated (days ago)',
  irr_disease:'Detected Disease (optional)',
  irr_disease_hint:'Run a disease scan first for auto-fill.',
  irr_weather_label:'Auto-fill from Weather',
  irr_city_ph:'City name (e.g. Kathmandu)',
  irr_fetch_btn:'Fetch Weather', irr_calc_btn:'Calculate Irrigation',
  irr_result_label:'Recommendation', irr_volume_label:'Recommended Volume',
  irr_timing_label:'Irrigate In', irr_method_label:'Method',
  irr_risk_label:'Water Risk', irr_savings_label:'Water Savings',
  irr_savings_vs:'vs. habit-based irrigation',
  irr_disease_mod_label:'Disease Modifier Applied',
  irr_placeholder_title:'Fill in your field details',
  irr_placeholder_sub:'Your personalised irrigation recommendation will appear here.',
  irr_placeholder_tip:'Pro tip: Run a disease scan first to get disease-aware irrigation advice.',
  irr_weather_title:'Weather Forecast',
  stage_seedling:'Seedling', stage_vegetative:'Vegetative',
  stage_flowering:'Flowering', stage_fruiting:'Fruiting / Grain fill',
  stage_ripening:'Ripening / Maturity',
  soil_loamy:'Loamy', soil_sandy:'Sandy', soil_clay:'Clay', soil_silt:'Silt',
  disease_none:'None / Not scanned yet', disease_healthy:'Healthy Plant',
});

Object.assign(TRANSLATIONS.ne, {
  /* ── INDEX sections ── */
  farmers_shop_title:'किसान पसल', consumer_shop_title:'उपभोक्ता पसल',
  disease_section_title:'रोग पहिचान',
  ai_detect_title:'AI रोग पहिचान',
  ai_detect_desc:'कुनै पनि पातको फोटो अपलोड गर्नुहोस्। मोडेलले पूर्ण विश्लेषण दिन्छ, केवल लेबल होइन।',
  detect_f1_title:'रोग पहिचान',       detect_f1_desc:'— जहाँ सम्भव प्रजाति स्तरमा',
  detect_f2_title:'विश्वास स्कोर',    detect_f2_desc:'— मोडेल कति निश्चित छ',
  detect_f3_title:'गम्भीरता',          detect_f3_desc:'— प्रारम्भिक, मध्यम, वा उन्नत',
  detect_f4_title:'चिन्हित क्षेत्र',  detect_f4_desc:'— ठीक प्रभावित भाग, रेखाङ्कित',
  detect_f5_title:'सरल भाषामा व्याख्या', detect_f5_desc:'— मोडेलले किन त्यस्तो ठान्यो',
  detect_f6_title:'उपचार सिफारिस',    detect_f6_desc:'— अर्को के गर्ने',
  irrigation_advisor_title:'स्मार्ट सिँचाइ सल्लाहकार',
  irrigation_advisor_desc:'छ वटा लाइभ इनपुट मिलाएर एउटै प्रश्नको जवाफ दिन्छ: अहिले पानी दिने कि पर्खने?',
  irrigation_output_label:'आउटपुट:',
  irrigation_output_text:'कहिले र कति सिँचाइ — बाली नसुकाइ पानी बचत गर्न मिलाइएको।',
  integrated_title:'एकीकृत बुद्धिमत्ता',
  integrated_desc:'पहिचान केवल रिपोर्टमा बस्दैन — यसले सिँचाइ सल्लाहकारको सिफारिस बदल्छ। चिट्ठेधूले रोग पत्ता लागेमा सिँचाइ सल्लाहकारले स्वतः आवृत्ति घटाउँछ।',
  integrated_step1:'चिट्ठेधूले रोग पत्ता लाग्यो',
  integrated_step2:'सिँचाइ आवृत्ति घटाइयो',
  integrated_step3:'आर्द्रता घट्छ, फैलिने जोखिम घट्छ',
  /* ── INDEX dashboard ── */
  dashboard_title:'फार्म ड्यासबोर्ड',
  dashboard_desc:'दुवै इन्जिनले सिकेका कुरा पाँच संख्यामा समेटिन्छन् जुन किसानले दस सेकेन्डमा जाँच गर्न सक्छन्।',
  db_health_label:'फार्म स्वास्थ्य स्कोर', db_risk_label:'रोगको जोखिम',
  db_water_label:'पानी उपयोग',             db_scans_label:'स्क्यान',
  db_scans_sub:'हालसालैका स्क्यान रेकर्ड', db_action_label:'सिफारिस गरिएको कार्य',
  db_products_label:'हालसालैका स्क्यानका आधारमा सिफारिस गरिएका उत्पादन',
  db_run_scan:'ड्यासबोर्ड अपडेट गर्न नयाँ स्क्यान गर्नुहोस्',
  db_loading:'लोड हुँदैछ...', db_live:'लाइभ डेटा',
  db_offline:'ब्याकएन्ड अफलाइन — लाइभ डेटाको लागि सर्भर सुरु गर्नुहोस्',
  /* ── INDEX predictive ── */
  predict_title:'भविष्यवाणी विश्लेषण',
  predict_desc:'मौसम र वातावरणीय डेटा — आर्द्रता प्रवृत्ति, पात भिजने अवधि, तापमान उतारचढाव — प्राय: पातमा लक्षण देखिनुभन्दा दिन अगावै प्रकोपको संकेत दिन्छ।',
  predict_chart_label:'वातावरणीय जोखिम सूचकाङ्क', predict_chart_window:'१४ दिनको विन्डो',
  predict_chart_note:'जोखिम लक्षण देखिनु अगावै बढ्छ — रोकथाम उपचार सबैभन्दा सस्तो हुने समय।',
  /* ── INDEX beyond ── */
  beyond_title:'मूल विशेषताभन्दा परे',
  feat_satellite_title:'स्याटेलाइट र ड्रोन दृश्य',
  feat_satellite_desc:'उही जोखिम डेटामा थपिएको खेत-स्तर दृश्यावलोकन।',
  feat_voice_title:'बहुभाषिक वाचा सहायक',
  feat_voice_desc:'प्रश्न सोध्नुहोस् र किसानकै भाषामा सिफारिस सुन्नुहोस्।',
  feat_offline_title:'अफलाइन मोड',
  feat_offline_desc:'सिग्नल नभए पनि पहिचान चल्छ; जडान फर्किएपछि नतिजा सिङ्क हुन्छ।',
  feat_xai_title:'व्याख्यायोग्य AI',
  feat_xai_desc:'हरेक निदानसँग केवल लेबल होइन, पछाडिको तर्क पनि आउँछ।',
  feat_community_title:'सामुदायिक रोग सतर्कता',
  feat_community_desc:'नजिकका फार्मले प्रकोप रिपोर्ट गर्दा छिमेकी खेतलाई प्रारम्भिक चेतावनी मिल्छ।',
  feat_water_title:'पानी बचत विश्लेषण',
  feat_water_desc:'वास्तविक अवस्थामा सिँचाइ मिलाउँदा बचाइएका लिटर ट्र्याक गर्नुहोस्।',
  /* ── INDEX why choose ── */
  why_title:'AgriGuardian किन छान्ने?',
  why_desc:'अधिकांश उपकरण लेबलमा रोकिन्छन्। AgriGuardian AI दृष्टि, मौसम, सिँचाइ र पसललाई एउटै लूपमा जोड्छ।',
  why_1:'पहिचान र सिँचाइ एउटै निर्णय लूप साझा गर्छन्, दुई छुट्टा एप होइन।',
  why_2:'लक्षण देखिनुअघि नै वातावरणीय प्रवृत्तिबाट प्रकोपको भविष्यवाणी।',
  why_3:'निदान नतिजाबाटै उपचार उत्पादन सिफारिस हुन्छन्।',
  why_4:'किसानले सिधै प्लेटफर्मबाट आफ्नो उपज लिस्ट गरी बेच्न सक्छन्।',
  /* ── DISEASES page ── */
  diseases_tag:'तत्काल AI निदान',
  diseases_h1:'रोग देख्नुहोस् — पात देखाउनुभन्दा पहिले।',
  diseases_desc:'बिरुवाको पातको फोटो अपलोड गर्नुहोस्। AI ले तुरुन्त लक्षण विश्लेषण गर्छ, रोग पहिचान गर्छ र हाम्रो पसलबाट लक्षित उपचार सिफारिस गर्छ।',
  upload_title:'पातको फोटो अपलोड गर्नुहोस्',
  upload_sub:'JPG, PNG, WEBP समर्थित · अधिकतम 10MB',
  upload_powered:'Gemini Vision AI द्वारा संचालित',
  loading_analyzing:'पातको संरचना विश्लेषण हुँदैछ...',
  error_title:'तस्वीर पहिचान भएन',
  error_default:'वैध पातको संरचना पत्ता लागेन। कृपया बिरुवाको पातको स्पष्ट फोटो अपलोड गर्नुहोस्।',
  try_again:'पुनः प्रयास गर्नुहोस्',
  results_title:'स्क्यान नतिजा',
  result_affected_label:'प्रभावित क्षेत्र', result_confidence_label:'विश्वास',
  scan_another:'अर्को तस्वीर स्क्यान गर्नुहोस्',
  irrigation_advice_btn:'सिँचाइ सल्लाह',
  recommended_treatments:'सिफारिस गरिएका उपचार',
  from_our_shop:'(हाम्रो पसलबाट)',
  severity_advice_label:'गम्भीरता सल्लाह',
  about_disease_title:'यो रोगबारे',
  cause_label:'कारण', symptoms_label_text:'लक्षणहरू',
  full_irrigation_label:'पूर्ण सिँचाइ सिफारिस',
  demo_mode_title:'डेमो मोड',
  priority_prefix:'प्राथमिकता',
  /* ── FARMER page ── */
  farmer_tag:'उपचार · उपकरण · सेन्सर',
  farmer_h1:'किसान पसल',
  farmer_desc:'रोग पहिचान र स्मार्ट सिँचाइको लागि चाहिने सबै कुरा। AI स्क्यानपछि सिधै सिफारिस गरिएका उत्पादन।',
  sell_produce_btn:'आफ्नो उपज बेच्नुहोस्',
  filter_all:'सबै उत्पादन', filter_treatment:'उपचार',
  filter_equipment:'उपकरण', filter_sensor:'सेन्सर',
  products_loading:'उत्पादन लोड हुँदैछ...',
  products_error:'उत्पादन लोड गर्न सकिएन। ब्याकएन्ड सर्भर चलिरहेको सुनिश्चित गर्नुहोस्।',
  sell_modal_title:'आफ्नो उपज सूचीबद्ध गर्नुहोस्',
  field_your_name:'तपाईंको नाम', field_farm_name:'फार्मको नाम',
  field_crop_name:'बालीको नाम',  field_unit:'इकाई',
  field_price:'मूल्य (रु.)',      field_quantity:'उपलब्ध मात्रा',
  field_description:'विवरण',
  field_photo:'उत्पादनको फोटो',  field_photo_optional:'(ऐच्छिक)',
  photo_drop_title:'क्लिक गरेर वा तान्दै छाड्नुहोस्',
  photo_drop_sub:'JPG, PNG, WEBP · अधिकतम 5MB',
  photo_tip:'राम्रो फोटोले उपभोक्तालाई तपाईंको उपज छान्न मद्दत गर्छ।',
  check_disease_free:'रोगमुक्त प्रमाणित (AI स्क्यान गरिएको)',
  check_irrigation_opt:'सिँचाइ-अनुकूलित',
  submit_listing:'सूची पेश गर्नुहोस्',
  unit_kg:'प्रति के.जी.', unit_bundle:'प्रति गुच्छा', unit_piece:'प्रति थान',
  unit_dozen:'प्रति दर्जन', unit_quintal:'प्रति क्विन्टल',
  /* ── CONSUMER page ── */
  consumer_tag:'ताजा · प्रमाणित · पारदर्शी',
  consumer_h1:'उपभोक्ता पसल',
  consumer_desc:'स्थानीय किसानहरूले सिधै सूचीबद्ध गरेका ताजा उपज। हरेक वस्तुले कसरी उत्पादन भयो देखाउँछ।',
  consumer_farmer_cta:'के तपाईं किसान हुनुहुन्छ? आफ्नो उपज सूचीबद्ध गर्नुहोस्',
  badge_verified:'AgriGuardian प्रमाणित', badge_water:'पानी-अनुकूलित',
  badge_disease_free_cert:'रोगमुक्त प्रमाणित',
  search_ph:'बाली, फार्मको नाम खोज्नुहोस्...',
  produce_loading:'उपज सूची लोड हुँदैछ...',
  produce_error:'उपज सूची लोड गर्न सकिएन। ब्याकएन्ड सर्भर चलिरहेको सुनिश्चित गर्नुहोस्।',
  produce_empty:'तपाईंको खोजसँग मिल्ने उपज फेला परेन।',
  disease_free_tag:'रोगमुक्त', water_smart_tag:'पानी-स्मार्ट',
  /* ── CART page ── */
  cart_title:'तपाईंको कार्ट',
  cart_empty_title:'तपाईंको कार्ट अहिले खाली छ।',
  cart_empty_sub:'पसलबाट उत्पादन वा रोग स्क्यानपछि सिफारिस गरिएका उपचार थप्नुहोस्।',
  continue_shopping:'किनमेल जारी राख्नुहोस्', scan_leaf_btn:'पात स्क्यान गर्नुहोस्',
  order_summary:'अर्डर सारांश',
  subtotal_label:'उप-जम्मा', delivery_label:'डेलिभरी',
  delivery_free:'निःशुल्क', total_label:'जम्मा',
  name_ph:'तपाईंको नाम', phone_ph:'फोन नम्बर', address_ph:'डेलिभरी ठेगाना',
  checkout_btn:'चेकआउटमा जानुहोस्',
  free_delivery_note:'रु. २,००० माथिको अर्डरमा निःशुल्क डेलिभरी',
  order_confirmed_title:'अर्डर पुष्टि भयो!',
  order_delivery_est:'अनुमानित डेलिभरी: २-३ कार्यदिन',
  /* ── IRRIGATION page ── */
  irr_tag:'AI-संचालित · मौसम-सजग · रोग-एकीकृत',
  irr_h1:'स्मार्ट सिँचाइ', irr_h1_accent:'सल्लाहकार',
  irr_desc:'आफ्नो खेतको अवस्था भर्नुहोस् र प्रमाणमा आधारित सिँचाइ सिफारिस पाउनुहोस्।',
  irr_form_title:'खेतका मापदण्डहरू',
  irr_crop_type:'बाली प्रकार', irr_growth_stage:'वृद्धि चरण',
  irr_soil_moisture:'माटोको आर्द्रता', irr_soil_type:'माटोको प्रकार',
  irr_area:'खेतको क्षेत्र (बिघा)', irr_temp:'तापमान (°C)',
  irr_humidity:'आर्द्रता', irr_rain:'वर्षा पूर्वानुमान (mm/२४घण्टा)',
  irr_last_irr:'अन्तिम सिँचाइ (दिन अगाडि)',
  irr_disease:'पत्ता लागेको रोग (ऐच्छिक)',
  irr_disease_hint:'स्वत: भर्नका लागि पहिले रोग स्क्यान गर्नुहोस्।',
  irr_weather_label:'मौसमबाट स्वत: भर्नुहोस्',
  irr_city_ph:'शहरको नाम (जस्तै काठमाडौं)',
  irr_fetch_btn:'मौसम ल्याउनुहोस्', irr_calc_btn:'सिँचाइ गणना गर्नुहोस्',
  irr_result_label:'सिफारिस', irr_volume_label:'सिफारिस मात्रा',
  irr_timing_label:'सिँचाइ गर्ने समय', irr_method_label:'विधि',
  irr_risk_label:'पानी जोखिम', irr_savings_label:'पानी बचत',
  irr_savings_vs:'बानीमा आधारित सिँचाइको तुलनामा',
  irr_disease_mod_label:'रोग परिमार्जक लागू',
  irr_placeholder_title:'खेतका विवरण भर्नुहोस्',
  irr_placeholder_sub:'तपाईंको व्यक्तिगत सिँचाइ सिफारिस यहाँ देखिनेछ।',
  irr_placeholder_tip:'सुझाव: रोग-सजग सिँचाइ सल्लाहका लागि पहिले रोग स्क्यान गर्नुहोस्।',
  irr_weather_title:'मौसम पूर्वानुमान',
  stage_seedling:'बिउ चरण', stage_vegetative:'वनस्पति चरण',
  stage_flowering:'फूल फुल्ने चरण', stage_fruiting:'फल/दाना भर्ने चरण',
  stage_ripening:'पाक्ने/परिपक्व चरण',
  soil_loamy:'दोमट माटो', soil_sandy:'बलौटे माटो',
  soil_clay:'चिल्लो माटो', soil_silt:'सिल्ट माटो',
  disease_none:'केही छैन / स्क्यान गरिएको छैन', disease_healthy:'स्वस्थ बिरुवा',
});

// ── 3. Engine ─────────────────────────────────────────────────────────────────

/** Return translation for key in current language (falls back to English) */
function t(key) {
  var lang = localStorage.getItem('agri-lang') || 'en';
  var set = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return set[key] !== undefined ? set[key] : (TRANSLATIONS.en[key] !== undefined ? TRANSLATIONS.en[key] : key);
}

/** Walk DOM and swap every data-i18n / data-i18n-placeholder / data-i18n-title element */
function applyTranslations() {
  var lang = localStorage.getItem('agri-lang') || 'en';
  var set = TRANSLATIONS[lang] || TRANSLATIONS.en;

  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var v = set[el.dataset.i18n] !== undefined ? set[el.dataset.i18n] : TRANSLATIONS.en[el.dataset.i18n];
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    var v = set[el.dataset.i18nPlaceholder] !== undefined ? set[el.dataset.i18nPlaceholder] : TRANSLATIONS.en[el.dataset.i18nPlaceholder];
    if (v !== undefined) el.placeholder = v;
  });
  document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
    var v = set[el.dataset.i18nTitle] !== undefined ? set[el.dataset.i18nTitle] : TRANSLATIONS.en[el.dataset.i18nTitle];
    if (v !== undefined) el.title = v;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
    var v = set[el.dataset.i18nHtml] !== undefined ? set[el.dataset.i18nHtml] : TRANSLATIONS.en[el.dataset.i18nHtml];
    if (v !== undefined) el.innerHTML = v;
  });

  document.documentElement.setAttribute('lang', lang === 'ne' ? 'ne' : 'en');

  // update button label
  document.querySelectorAll('.lang-toggle-btn').forEach(function(btn) {
    btn.textContent = lang === 'ne' ? 'EN' : 'नेपाली';
    btn.title = lang === 'ne' ? 'Switch to English' : 'नेपालीमा हेर्नुहोस्';
  });
}

/** Toggle language and re-render */
function toggleLanguage() {
  var next = (localStorage.getItem('agri-lang') || 'en') === 'en' ? 'ne' : 'en';
  localStorage.setItem('agri-lang', next);
  applyTranslations();
  // re-render any dynamic content that uses t()
  if (typeof rerenderDynamic === 'function') rerenderDynamic();
}

// ── 4. DOMContentLoaded: inject toggle button + apply ────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  var currentLang = localStorage.getItem('agri-lang') || 'en';

  document.querySelectorAll('.lang-toggle-slot').forEach(function(slot) {
    var btn = document.createElement('button');
    btn.className = 'lang-toggle-btn font-mono text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-line text-inksoft hover:border-canopy hover:text-ink transition-colors';
    btn.style.minWidth = '56px';
    btn.textContent = currentLang === 'ne' ? 'EN' : 'नेपाली';
    btn.title = currentLang === 'ne' ? 'Switch to English' : 'नेपालीमा हेर्नुहोस्';
    btn.setAttribute('aria-label', 'Toggle language');
    btn.addEventListener('click', toggleLanguage);
    slot.replaceWith(btn);
  });

  applyTranslations();
});
