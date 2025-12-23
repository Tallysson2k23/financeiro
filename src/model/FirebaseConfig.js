// Importando as funções necessárias do Firebase via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// COLE AQUI os seus dados que você copiou do console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCQNv4l3qZEeqj0kowO4rfyMCtJeUyVe6w",
  authDomain: "financeiro-f30f3.firebaseapp.com",
  projectId: "financeiro-f30f3",
  storageBucket: "financeiro-f30f3.firebasestorage.app",
  messagingSenderId: "560002994616",
  appId: "1:560002994616:web:f3a278533cb98ead5ebf4d"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços para serem usados no Model
export const auth = getAuth(app);
export const db = getFirestore(app);