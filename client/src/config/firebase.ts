import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration - replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBLTyhc2p5HFH_0zKC_OB3s3uvok4LrPtY",
    authDomain: "crafty-biplane-431510-b5.firebaseapp.com",
    projectId: "crafty-biplane-431510-b5",
    storageBucket: "crafty-biplane-431510-b5.appspot.com",
    messagingSenderId: "393057439859",
    appId: "1:393057439859:web:f9e25a10fb2ba1c1859a06",
    measurementId: "G-K8PY9HVMF1",
    clientId: "144495563966-9j73e1n8tba2felgg7mhmq0p5atiq1er.apps.googleusercontent.com", // OAuth Client ID
    clientSecret: "GOCSPX-yUEv8P2tE28X_ZD6DA1A9b-olf" // OAuth Client Secret
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

export { app, auth }; 