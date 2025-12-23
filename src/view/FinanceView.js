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

        lista.innerHTML = contas.map(conta => {
            const estaPaga = conta.paga === true;
            
            const classeCard = estaPaga ? 'card-conta paga' : 'card-conta';
            const classeValor = estaPaga ? 'valor-pago' : 'valor-pendente';
            const textoBotao = estaPaga ? 'Pago' : 'Pagar';
            
            // Corrigido: Vermelho se não pago (#ef4444), Verde se pago (#10b981)
            const estiloBotao = estaPaga 
                ? 'background-color: #10b981;' 
                : 'background-color: #ef4444;';

            return `
                <div class="${classeCard}">
                    <div class="info">
                        <h4 style="color: #1e293b;">${conta.banco}</h4>
                        <span>Vence: ${this.formatarData(conta.dataVencimento)}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div class="${classeValor}">
                            R$ ${parseFloat(conta.valor).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                        </div>
                        
                        <button 
                            onclick="controller.darBaixa('${conta.id}')" 
                            class="btn-check" 
                            style="${estiloBotao}">
                            ${textoBotao}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    formatarData(data) {
        if (!data) return "--/--";
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}`;
    }

    limparFormulario() {
        const form = document.getElementById('form-conta');
        if (form) form.reset();
    }
}