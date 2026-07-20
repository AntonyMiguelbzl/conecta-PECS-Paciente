import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Importamos as funções necessárias para configurar a persistência e o protocolo
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDYQEoW4OuFLeXfQwb1mKxJuWtuuHdqZYM",
  authDomain: "conecta-pecs.firebaseapp.com",
  projectId: "conecta-pecs",
  storageBucket: "conecta-pecs.firebasestorage.app",
  messagingSenderId: "942692339665",
  appId: "1:942692339665:web:335bb100b6fd5092ccdaf0",
  measurementId: "G-YKHCTWMRVL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// A MUDANÇA: Inicializamos o Firestore com configurações de estabilidade para iOS
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  // Esta configuração reduz drasticamente os erros de CORS/Access Control no iOS
  experimentalForceLongPolling: true 
});