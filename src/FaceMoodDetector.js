import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

function FaceMoodDetector({ onMoodDetected }) {
  const videoRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [stream, setStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

 useEffect(() => {
  const loadModels = async () => {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    console.log("➡️ Trying to load models from:", MODEL_URL);  // ✅ log path

    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
      console.log("✅ Models loaded successfully");
    } catch (err) {
      console.error("❌ Model load error:", err);
      alert("Models could not be loaded. Check /public/models folder and ensure correct path.");
    }
  };

  loadModels();
}, []);


  const stopVideoStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsDetecting(false);
  };

  const handleDetect = async () => {
    if (!modelsLoaded) {
      alert("Models are still loading. Please wait...");
      return;
    }

    setIsDetecting(true);

    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
        setStream(videoStream);

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();

          setTimeout(async () => {
            try {
              const detection = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

              if (detection?.expressions) {
                const sorted = Object.entries(detection.expressions).sort((a, b) => b[1] - a[1]);
                const topMood = sorted[0][0];
                console.log("🧠 Mood:", topMood);
                onMoodDetected(topMood);
              } else {
                alert("No face detected. Try again.");
              }
            } catch (err) {
              console.error("Detection error:", err);
              alert("Error during mood detection.");
            }

            stopVideoStream();
          }, 5000);
        };
      }
    } catch (err) {
      console.error("❌ Camera access error:", err);
      alert("Please allow camera access to detect mood.");
      setIsDetecting(false);
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      {!isDetecting && (
        <button
          onClick={handleDetect}
          disabled={!modelsLoaded}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '8px',
            backgroundColor: modelsLoaded ? '#6200ea' : '#aaa',
            color: 'white',
            border: 'none',
            cursor: modelsLoaded ? 'pointer' : 'not-allowed'
          }}
        >
          🎥 {modelsLoaded ? 'Start Mood Detection' : 'Loading...'}
        </button>
      )}

      {isDetecting && (
        <div>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            width="320"
            height="240"
            style={{
              marginTop: '20px',
              borderRadius: '10px',
              background: '#000',
              display: 'block'
            }}
          />
          <p style={{ marginTop: '10px' }}>⏳ Detecting in 5 seconds...</p>
        </div>
      )}
    </div>
  );
}

export default FaceMoodDetector;
