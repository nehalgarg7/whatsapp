// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0todr7JrON1JZBYAFGmCIwP99Jbxp4jk",
  authDomain: "whatsapp-clone-41031.firebaseapp.com",
  projectId: "whatsapp-clone-41031",
  storageBucket: "whatsapp-clone-41031.appspot.com",
  messagingSenderId: "957762311299",
  appId: "1:957762311299:web:19b3ecb7ffe75e9d51f7b6",
  measurementId: "G-3L971HQXV5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
