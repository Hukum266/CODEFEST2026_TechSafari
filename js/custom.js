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