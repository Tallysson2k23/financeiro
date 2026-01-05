import { db } from './FirebaseConfig.js';
import {
    collection, addDoc, query, where, getDocs,
    doc, updateDoc, getDoc, deleteDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export class FinanceModel {

    async salvarConta(conta, userId) {
        await addDoc(collection(db, "contas"), {
            ...conta,
            usuarioId: userId,
            paga: false,
            criadoEm: new Date()
        });
    }

    async buscarContas(userId) {
        const q = query(collection(db, "contas"), where("usuarioId", "==", userId));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }

    async alternarStatusPagamento(id) {
        const ref = doc(db, "contas", id);
        const snap = await getDoc(ref);
        await updateDoc(ref, { paga: !snap.data().paga });
    }

    async excluirConta(id) {
        await deleteDoc(doc(db, "contas", id));
    }

    async salvarResumoMensal(userId, ano, mes, total) {
        const id = `${userId}_${ano}_${mes}`;
        await setDoc(doc(db, "resumo_mensal", id), {
            usuarioId: userId,
            ano,
            mes,
            totalGasto: total,
            atualizadoEm: new Date()
        });
    }

    async buscarResumo(userId, qtd) {
        const q = query(collection(db, "resumo_mensal"), where("usuarioId", "==", userId));
        const snap = await getDocs(q);

        return snap.docs
            .map(d => d.data())
            .sort((a, b) => (a.ano * 12 + a.mes) - (b.ano * 12 + b.mes))
            .slice(-qtd);
    }
}
