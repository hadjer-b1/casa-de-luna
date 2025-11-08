// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXkwTXMj5p9xMqPpzOqzIe719BPmQc7BU",
  authDomain: "casa-de-luna-d5237.firebaseapp.com",
  projectId: "casa-de-luna-d5237",
  storageBucket: "casa-de-luna-d5237.firebasestorage.app",
  messagingSenderId: "64790649037",
  appId: "1:64790649037:web:913f85fb9b123c1679f184",
  measurementId: "G-E6KLNN8XQE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Initialize Auth + Google Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider };