import React, { useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

function FaceMoodDetector({ onMoodDetected }) {
  const videoRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [stream, setStream] = useState(null);

  const loadModels = async () => {
    const MODEL_URL = '/models';
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      console.log("✅ Models loaded");
    } catch (err) {
      console.error("❌ Model load error:", err);
      alert("Models could not be loaded. Check /public/models folder.");
    }
  };

  const stopVideoStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsDetecting(false);
  };

  const handleDetect = async () => {
    await loadModels();
    setIsDetecting(true);

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((videoStream) => {
        videoRef.current.srcObject = videoStream;
        setStream(videoStream);

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();

          // Wait 5 seconds before detection
          setTimeout(async () => {
            const detection = await faceapi
              .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
              .withFaceExpressions();

            if (detection?.expressions) {
              const sorted = Object.entries(detection.expressions).sort((a, b) => b[1] - a[1]);
              const topMood = sorted[0][0];
              console.log("🧠 Detected Mood:", topMood);
              onMoodDetected(topMood);
            } else {
              console.log("😐 No face detected");
              alert("No face detected. Try again.");
            }

            stopVideoStream(); // stop after detection
          }, 5000);
        };
      })
      .catch((err) => {
        console.error("❌ Camera access error:", err);
        alert("Camera access denied. Please allow permission.");
        setIsDetecting(false);
      });
  };

  return (
    <div style={{ marginTop: '30px' }}>
      {!isDetecting && (
        <button
          onClick={handleDetect}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '8px',
            backgroundColor: '#6200ea',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          🎥 Start Mood Detection
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
            style={{ marginTop: '20px', borderRadius: '10px', background: '#000' }}
          />
          <p style={{ marginTop: '10px' }}>⏳ Detecting in 5 seconds...</p>
        </div>
      )}
    </div>
  );
}

export default FaceMoodDetector;
