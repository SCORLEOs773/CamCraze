import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    // Load face-api.js models from public folder
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(
          MODEL_URL + "/tiny_face_detector"
        ),
        faceapi.nets.faceLandmark68Net.loadFromUri(
          MODEL_URL + "/face_landmark_68"
        ),
      ]);
      setIsModelLoaded(true);
    };

    loadModels();
    startVideo();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Camera error:", err));
  };

  useEffect(() => {
    if (!isModelLoaded) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const drawFilters = async () => {
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };
      faceapi.matchDimensions(canvas, displaySize);

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      const resized = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

      resized.forEach((detection) => {
        const ctx = canvas.getContext("2d");
        const landmarks = detection.landmarks;

        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const nose = landmarks.getNose();

        // 💡 Compute shared eye dimensions here
        const eyeWidth = rightEye[3].x - leftEye[0].x;
        const eyeHeight = (rightEye[3].y - leftEye[0].y) * 2;

        // 🎨 Draw Glasses
        const glassesImg = new Image();
        glassesImg.src = process.env.PUBLIC_URL + "/filters/glasses.png";
        glassesImg.onload = () => {
          ctx.drawImage(
            glassesImg,
            leftEye[0].x - eyeWidth * 0.2,
            leftEye[0].y - eyeHeight * 0.6,
            eyeWidth * 1.4,
            eyeHeight * 1.6
          );
        };

        // 🎩 Draw Hat
        const hatImg = new Image();
        hatImg.src = process.env.PUBLIC_URL + "/filters/hat.png";
        hatImg.onload = () => {
          const hatWidth = eyeWidth * 2;
          const hatHeight = eyeHeight * 2;
          const x = nose[0].x - hatWidth / 2;
          const y = nose[0].y - hatHeight * 1.6;
          ctx.drawImage(hatImg, x, y, hatWidth, hatHeight);
        };
      });

      requestAnimationFrame(drawFilters);
    };

    video.addEventListener("playing", () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      drawFilters();
    });
  }, [isModelLoaded]);

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "sans-serif",
        background: "#121212",
        color: "#fff",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1 style={{ marginBottom: "10px" }}>🎭 CamCraze – Live Face Filters</h1>
      <p style={{ marginBottom: "20px" }}>
        Move your face, wear virtual glasses & hats!
      </p>

      <div style={{ position: "relative", display: "inline-block" }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            borderRadius: "10px",
            width: "640px",
            transform: "scaleX(-1)",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: "scaleX(-1)",
          }}
        />
      </div>
    </div>
  );
}

export default App;
