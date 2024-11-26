import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4Owdw8M-rdtB0VPN6E3GkoOsAN7HF6mE",
  authDomain: "bikeshop-management-system.firebaseapp.com",
  databaseURL: "https://bikeshop-management-system-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bikeshop-management-system",
  storageBucket: "bikeshop-management-system.firebasestorage.app",
  messagingSenderId: "161123081063",
  appId: "1:161123081063:web:2a355364f881c5b97f6dc2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);