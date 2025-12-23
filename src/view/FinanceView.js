export class FinanceView {
    getFormData() {
        return {
            banco: document.getElementById('banco').value,
            valor: document.getElementById('valor').value,
            dataPagamento: document.getElementById('dataPagamento').value,
            dataVencimento: document.getElementById('dataVencimento').value
        };
    }

    renderizarContas(contas) {
        const lista = document.getElementById('lista-contas');
        if (!lista) return;

        if (contas.length === 0) {
            lista.innerHTML = `<p style="text-align:center; color:#94a3b8; margin-top:20px;">Nenhuma conta cadastrada.</p>`;
            return;
        }

        lista.innerHTML = contas.map(conta => `
            <div class="card-conta">
                <div class="info">
                    <h4>${conta.banco}</h4>
                    <span>Vence: ${this.formatarData(conta.dataVencimento)}</span>
                </div>
                <div class="valor">
                    R$ ${parseFloat(conta.valor).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                </div>
            </div>
        `).join('');
    }

    formatarData(data) {
        if (!data) return "--/--";
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}`;
    }

    limparFormulario() {
        document.getElementById('form-conta').reset();
    }
}