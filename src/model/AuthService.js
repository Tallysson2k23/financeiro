import { auth } from './FirebaseConfig.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export const AuthService = {
    // Criar nova conta
    async cadastrar(email, senha) {
        return createUserWithEmailAndPassword(auth, email, senha);
    },

    // Entrar na conta
    async login(email, senha) {
        return signInWithEmailAndPassword(auth, email, senha);
    },

    // Sair
    async logout() {
        return signOut(auth);
    },

    // Monitorar se o usuário está logado ou não
    observarEstado(callback) {
        onAuthStateChanged(auth, callback);
    }
};