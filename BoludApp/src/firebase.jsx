// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // 🟢 Importar Firestore

// Tu web app's Firebase configuration
// Asegúrate de que los valores aquí coincidan con los de tu consola de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDmxrRMjh6gSuitR9W7yGdZP_k5Mvx4aIA",
    authDomain: "boludapp-2c221.firebaseapp.com",
    projectId: "boludapp-2c221",
    storageBucket: "boludapp-2c221.firebasestorage.app",
    messagingSenderId: "640505067633",
    appId: "1:640505067633:web:9b23780f1f50fb03a583d0",
    measurementId: "G-Y8R700DYCT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 🟢 Inicializar y exportar la instancia de Firestore
export const db = getFirestore(app);

export default app;