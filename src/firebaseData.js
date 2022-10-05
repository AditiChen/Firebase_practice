import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyA6-utChW11wimnisYmH7mI418OG4l0QYo",
  authDomain: "fir-practice-12d25.firebaseapp.com",
  projectId: "fir-practice-12d25",
  storageBucket: "fir-practice-12d25.appspot.com",
  messagingSenderId: "353519730888",
  appId: "1:353519730888:web:1f5d35b4a7a908e14ee5fd",
  measurementId: "G-3T9NGEVYEE",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
