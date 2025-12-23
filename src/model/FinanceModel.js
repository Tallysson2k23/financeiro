import { db } from './FirebaseConfig.js';
import { collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export class FinanceModel {
    // Salva uma nova conta no banco
    async salvarConta(conta, userId) {
        try {
            const docRef = await addDoc(collection(db, "contas"), {
                ...conta,
                usuarioId: userId,
                criadoEm: new Date()
            });
            return docRef.id;
        } catch (e) {
            console.error("Erro ao salvar:", e);
            throw e;
        }
    }

    // BUSCA as contas do usuário (A função que estava faltando!)
    async buscarContas(userId) {
        try {
            const q = query(collection(db, "contas"), where("usuarioId", "==", userId));
            const querySnapshot = await getDocs(q);
            const contas = [];
            querySnapshot.forEach((doc) => {
                contas.push({ id: doc.id, ...doc.data() });
            });
            return contas;
        } catch (e) {
            console.error("Erro ao buscar contas:", e);
            return [];
        }
    }
}