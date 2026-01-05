import { db } from './FirebaseConfig.js';
// Adicionei doc, updateDoc e getDoc na importação abaixo
import { 
  collection, addDoc, query, where, getDocs, 
  doc, updateDoc, getDoc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


export class FinanceModel {
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

    async excluirConta(idConta) {
    try {
        const contaRef = doc(db, "contas", idConta);
        await deleteDoc(contaRef);
        return true;
    } catch (error) {
        console.error("Erro ao excluir conta:", error);
        throw error;
    }
}


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

    async alternarStatusPagamento(id) {
        try {
            // Corrigido: usando a variável 'db' importada e as funções do Firebase
            const contaRef = doc(db, "contas", id);
            const contaSnap = await getDoc(contaRef);
            
            if (contaSnap.exists()) {
                const statusAtual = contaSnap.data().paga || false;
                await updateDoc(contaRef, { paga: !statusAtual });
                return true;
            }
        } catch (error) {
            console.error("Erro ao alternar status no Firebase:", error);
            throw error;
        }
    }
}