# CamCraze – Live Face Filters App

**CamCraze** is a real-time face filter application that uses webcam video feed to apply virtual glasses, hats, and other customizable filters on a user's face. Built using React and **Face-api.js**, the app uses state-of-the-art face detection and landmark mapping techniques to identify and position filters correctly.

### Features:
- **Real-time Face Detection:** Detects faces and their landmarks such as eyes, nose, and mouth.
- **Face Filters:** Apply customizable filters (like glasses and hats) on the face in real-time.
- **Webcam Integration:** Uses the device's webcam to stream video and overlay filters live.

---

## Key Technologies Used:
- **React** – Frontend library for building the user interface.
- **Face-api.js** – Face detection and landmark detection library.
  - **Tiny Face Detector** – For detecting faces in real-time.
  - **Face Landmark Detection** – For pinpointing specific facial features.
  - **Face Recognition** – Optional for face recognition and identity verification.
- **JavaScript (ES6+)** – Modern JavaScript syntax for functionality and features.
- **Canvas API** – For rendering filters on top of the live webcam feed.
- **HTML5** – Structure of the page and video streaming.
- **CSS3** – Styling the application for a clean and modern look.
- **MediaDevices API** – For accessing the device's webcam in real-time.

---

## How to Run:

### 1. Clone the repository:
```bash
git clone https://github.com/your-username/CamCraze.git
cd CamCraze
