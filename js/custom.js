tailwind.config = {
  theme: {
    extend: {
      colors: {
        paper: '#F3F5EC',
        paperdeep: '#E7EBDA',
        ink: '#1C2618',
        inksoft: '#4A5741',
        canopy: '#2F5233',
        canopylight: '#4F7A52',
        soil: '#8B5E34',
        irrigation: '#2F6690',
        amber: '#B8710F',
        rust: '#A8452F',
        line: '#D4DAC4',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
};


//Gemini API 
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "YOUR_API_KEY",
});

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "Explain Artificial Intelligence.",
});

console.log(response.text);

//Diseas Detection 
function handleUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const uploadUI = document.getElementById('upload-ui');
      const loadingUI = document.getElementById('loading-ui');
      const resultsUI = document.getElementById('results-ui');
      const previewImg = document.getElementById('preview-image');

      // 1. Create local URL for preview
      const imageURL = URL.createObjectURL(file);
      previewImg.src = imageURL;

      // 2. Hide Upload UI, Show Loading UI
      uploadUI.classList.add('hidden');
      loadingUI.classList.remove('hidden');
      loadingUI.classList.add('flex');
      resultsUI.classList.add('hidden');

      // 3. Simulate processing time
      setTimeout(() => {
        loadingUI.classList.remove('flex');
        loadingUI.classList.add('hidden');
        
        // 4. Show Results UI
        resultsUI.classList.remove('hidden');
        
        // 5. Scroll to results
        resultsUI.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 2500);
    }


    //Farmers shop and consumers shop 
    
// Function to update the cart badge on page load
document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("agriCart")) || [];
    const badge = document.getElementById("nav-cart-badge");
    // Only update if the badge element exists on this page
    if (badge) badge.innerText = cart.length; 
});

// Function to handle adding items to the cart
function addToCart(button, name, price, image) {
    // 1. Get existing cart from local storage or create a new one
    let cart = JSON.parse(localStorage.getItem("agriCart")) || [];
    
    // 2. Add the new item
    cart.push({ name: name, price: price, image: image });
    
    // 3. Save it back to Local Storage
    localStorage.setItem("agriCart", JSON.stringify(cart));
    
    // 4. Update the UI Badge (Assumes your nav cart badge has id="nav-cart-badge")
    const badge = document.getElementById("nav-cart-badge");
    if (badge) badge.innerText = cart.length;

    // 5. Provide visual feedback on the button itself
    const originalText = button.innerText;
    button.innerText = "Added ✓";
    button.classList.remove('text-canopy', 'border-canopy/40');
    button.classList.add('bg-canopy', 'text-paper', 'border-canopy');
    
    // 6. Reset button after 2 seconds
    setTimeout(() => {
        button.innerText = originalText;
        button.classList.remove('bg-canopy', 'text-paper', 'border-canopy');
        button.classList.add('text-canopy', 'border-canopy/40');
    }, 2000);
}


//Farmers and consumers shop

// Function to update the cart badge on page load
document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("agriCart")) || [];
    const badge = document.getElementById("nav-cart-badge");
    // Only update if the badge element exists on this page
    if (badge) badge.innerText = cart.length; 
});

// Function to handle adding items to the cart
function addToCart(button, name, price, image) {
    // 1. Get existing cart from local storage or create a new one
    let cart = JSON.parse(localStorage.getItem("agriCart")) || [];
    
    // 2. Add the new item
    cart.push({ name: name, price: price, image: image });
    
    // 3. Save it back to Local Storage
    localStorage.setItem("agriCart", JSON.stringify(cart));
    
    // 4. Update the UI Badge (Assumes your nav cart badge has id="nav-cart-badge")
    const badge = document.getElementById("nav-cart-badge");
    if (badge) badge.innerText = cart.length;

    // 5. Provide visual feedback on the button itself
    const originalText = button.innerText;
    button.innerText = "Added ✓";
    button.classList.remove('text-canopy', 'border-canopy/40');
    button.classList.add('bg-canopy', 'text-paper', 'border-canopy');
    
    // 6. Reset button after 2 seconds
    setTimeout(() => {
        button.innerText = originalText;
        button.classList.remove('bg-canopy', 'text-paper', 'border-canopy');
        button.classList.add('text-canopy', 'border-canopy/40');
    }, 2000);
}





//Camera Scanner
const video = document.getElementById("camera");

let stream = null;

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    video.srcObject = stream;

  } catch (error) {
    console.error("Camera access denied:", error);
    alert("Unable to access the camera.");
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }
}

document.getElementById("startBtn").addEventListener("click", startCamera);
document.getElementById("stopBtn").addEventListener("click", stopCamera);