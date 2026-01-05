import { AuthService } from '../model/AuthService.js';

export class FinanceController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.usuarioLogado = null;
    }

    init() {
        AuthService.observarEstado(async user => {
            if (user) {
                this.usuarioLogado = user;
                document.getElementById('auth-container').style.display = 'none';
                document.getElementById('app-container').style.display = 'block';
                await this.carregarTudo();
            }
        });

        document.getElementById('btn-salvar').addEventListener('click', e => {
            e.preventDefault();
            this.salvarConta();
        });

        document.getElementById('btn-abrir-modal')
            .addEventListener('click', () =>
                document.getElementById('modal-cadastro').style.display = 'flex'
            );

        document.getElementById('btn-cancelar')
            .addEventListener('click', () =>
                document.getElementById('modal-cadastro').style.display = 'none'
            );

        window.controller = this;
    }

    async salvarConta() {
        const dados = this.view.getFormData();

        if (!dados.banco || !dados.valor) {
            alert("Preencha banco e valor");
            return;
        }

        await this.model.salvarConta(
            { ...dados, paga: false },
            this.usuarioLogado.uid
        );

        document.getElementById('modal-cadastro').style.display = 'none';
        this.view.limparFormulario();
        await this.carregarTudo();
    }

    async carregarTudo() {
        const contas = await this.model.buscarContas(this.usuarioLogado.uid);

        this.view.renderizarContas(contas);

        // ⚠️ só atualiza resumo do mês atual
        this.atualizarResumo(contas);

        await this.carregarGraficos();
    }

    atualizarResumo(contas) {
        const hoje = new Date();
        const mesAtual = hoje.getMonth() + 1;
        const anoAtual = hoje.getFullYear();

        let devedor = 0;
        let pago = 0;
        let totalMesAtual = 0;

        contas.forEach(conta => {
            const valor = Number(conta.valor) || 0;

            conta.paga ? pago += valor : devedor += valor;

            const data = new Date(conta.dataVencimento);
            if (
                data.getMonth() + 1 === mesAtual &&
                data.getFullYear() === anoAtual
            ) {
                totalMesAtual += valor;
            }
        });

        document.getElementById('total-devedor').innerText =
            `R$ ${devedor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

        document.getElementById('total-restante').innerText =
            `R$ ${pago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

        // 🔒 Firebase só manda no mês atual
        this.model.salvarResumoMensal(
            this.usuarioLogado.uid,
            anoAtual,
            mesAtual,
            totalMesAtual
        );
    }

    async carregarGraficos() {

        const hoje = new Date();
        const mesAtual = hoje.getMonth() + 1;
        const anoAtual = hoje.getFullYear();

        // 🔹 Firebase (somente mês atual)
        const dadosFirebase = await this.model.buscarResumo(
            this.usuarioLogado.uid,
            12
        );

        // 🔹 Excel (histórico)
        const dadosMock = this.getDadosHistoricosMock();

        const mapa = {};

        // 1️⃣ Primeiro coloca Excel
        dadosMock.forEach(d => {
            mapa[`${d.ano}-${d.mes}`] = d;
        });

        // 2️⃣ Firebase só substitui se for mês atual
        dadosFirebase.forEach(d => {
            if (d.ano === anoAtual && d.mes === mesAtual) {
                mapa[`${d.ano}-${d.mes}`] = d;
            }
        });

        const dadosFinal = Object.values(mapa).sort(
            (a, b) => (a.ano * 12 + a.mes) - (b.ano * 12 + b.mes)
        );

        this.view.renderizarGrafico(
            "grafico3Meses",
            dadosFinal,
            "Últimos 3 meses",
            3
        );

        this.view.renderizarGrafico(
            "grafico12Meses",
            dadosFinal,
            "Últimos 12 meses",
            12
        );
    }

    async darBaixa(id) {
        await this.model.alternarStatusPagamento(id);
        await this.carregarTudo();
    }

    async excluirConta(id) {
        if (!confirm("Deseja realmente excluir esta conta?")) return;
        await this.model.excluirConta(id);
        await this.carregarTudo();
    }

    // 🔹 HISTÓRICO VISUAL (EXCEL)
    getDadosHistoricosMock() {
        return [
            { mes: 8,  ano: 2024, totalGasto: 3911.27 },
            { mes: 9,  ano: 2024, totalGasto: 3552.64 },
            { mes: 10, ano: 2024, totalGasto: 3797.44 },
            { mes: 11, ano: 2024, totalGasto: 4494.51 },
            { mes: 12, ano: 2024, totalGasto: 3902.83 },

            { mes: 1,  ano: 2025, totalGasto: 4418.09 },
            { mes: 2,  ano: 2025, totalGasto: 4763.13 },
            { mes: 3,  ano: 2025, totalGasto: 5258.21 },
            { mes: 4,  ano: 2025, totalGasto: 3914.96 },
            { mes: 5,  ano: 2025, totalGasto: 5647.56 },
            { mes: 6,  ano: 2025, totalGasto: 4241.16 },
            { mes: 7,  ano: 2025, totalGasto: 7068.99 },
            { mes: 8,  ano: 2025, totalGasto: 3800.35 },
            { mes: 9,  ano: 2025, totalGasto: 4374.12 },
            { mes: 10, ano: 2025, totalGasto: 3888.79 },
            { mes: 11, ano: 2025, totalGasto: 3867.44 },
            { mes: 12, ano: 2025, totalGasto: 4535.56 }
        ];
    }
}
