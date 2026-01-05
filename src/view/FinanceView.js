export class FinanceView {
    getFormData() {
        return {
            banco: document.getElementById('banco').value,
            valor: document.getElementById('valor').value,
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

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0); // Zera as horas para comparação justa

        lista.innerHTML = contas.map(conta => {
            const estaPaga = conta.paga === true;
            
            // Lógica de Urgência (6 dias antes)
            const vencimento = new Date(conta.dataVencimento);
            vencimento.setHours(0, 0, 0, 0);
            const diferencaTempo = vencimento - hoje;
            const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
            
            // Fica "urgente" se faltar 6 dias ou menos e NÃO estiver paga
            const ehUrgente = !estaPaga && diferencaDias <= 6;

            // Definição de Classes CSS
            const classeCard = `card-conta ${estaPaga ? 'paga' : ''} ${ehUrgente ? 'urgente' : ''}`;
            const classeValor = estaPaga ? 'valor-pago' : 'valor-pendente';
            const textoBotao = estaPaga ? 'Pago' : 'Pagar';
            
            // Cor do Botão: Verde se pago, Vermelho se pendente
            const estiloBotao = estaPaga 
                ? 'background-color: #10b981;' 
                : 'background-color: #ef4444;';

            return `
                <div class="${classeCard}">
                    <div class="info">
                        <h4 style="color: #1e293b;">${conta.banco}</h4>
                        <span>Vence: ${this.formatarData(conta.dataVencimento)}</span>
                    </div>
<div style="display: flex; align-items: center; gap: 10px;">
    <div class="${classeValor}">
        R$ ${parseFloat(conta.valor).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
    </div>

    <button 
        onclick="controller.darBaixa('${conta.id}')" 
        class="btn-check" 
        style="${estiloBotao}">
        ${textoBotao}
    </button>

    <button 
        onclick="controller.excluirConta('${conta.id}')"
        class="btn-delete"
        title="Excluir conta">
        🗑
    </button>
</div>

                    </div>
                </div>
            `;
        }).join('');
    }

    formatarData(data) {
        if (!data) return "--/--";
        // Ajuste para evitar que o fuso horário mude o dia ao converter string
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}`;
    }

    limparFormulario() {
        const form = document.getElementById('form-conta');
        if (form) form.reset();
    }
}