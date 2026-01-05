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
            lista.innerHTML =
                `<p style="text-align:center;color:#94a3b8;margin-top:20px;">
                    Nenhuma conta cadastrada.
                 </p>`;
            return;
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        lista.innerHTML = contas.map(conta => {
            const estaPaga = conta.paga === true;

            const vencimento = new Date(conta.dataVencimento);
            vencimento.setHours(0, 0, 0, 0);

            const diferencaDias =
                Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));

            const ehUrgente = !estaPaga && diferencaDias <= 6;

            const classeCard =
                `card-conta ${estaPaga ? 'paga' : ''} ${ehUrgente ? 'urgente' : ''}`;

            const classeValor =
                estaPaga ? 'valor-pago' : 'valor-pendente';

            const textoBotao = estaPaga ? 'Pago' : 'Pagar';

            const estiloBotao = estaPaga
                ? 'background-color:#10b981;'
                : 'background-color:#ef4444;';

            return `
                <div class="${classeCard}">
                    <div class="info">
                        <h4>${conta.banco}</h4>
                        <span>Vence: ${this.formatarData(conta.dataVencimento)}</span>
                    </div>

                    <div style="display:flex;align-items:center;gap:10px;">
                        <div class="${classeValor}">
                            R$ ${Number(conta.valor).toLocaleString('pt-BR', {
                                minimumFractionDigits: 2
                            })}
                        </div>

                        <button
                            class="btn-check"
                            style="${estiloBotao}"
                            onclick="controller.darBaixa('${conta.id}')">
                            ${textoBotao}
                        </button>

                        <button
                            class="btn-delete"
                            title="Excluir conta"
                            onclick="controller.excluirConta('${conta.id}')">
                            🗑
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

renderizarGrafico(canvasId, dados, titulo, quantidadeMeses) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (this[canvasId]) this[canvasId].destroy();

    const mesesNome = [
        'Jan','Fev','Mar','Abr','Mai','Jun',
        'Jul','Ago','Set','Out','Nov','Dez'
    ];

    // 🔹 Gera os últimos N meses (estilo Excel)
    const agora = new Date();
    const labels = [];
    const valores = [];

    for (let i = quantidadeMeses - 1; i >= 0; i--) {
        const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
        const mes = d.getMonth() + 1;
        const ano = d.getFullYear();

        labels.push(`${mesesNome[mes - 1]}/${ano}`);

        const encontrado = dados.find(x => x.mes === mes && x.ano === ano);
        valores.push(encontrado ? encontrado.totalGasto : 0);
    }

    this[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: titulo,
                data: valores,
                backgroundColor: '#3b82f6',
                borderRadius: 6,
                categoryPercentage: 0.6,
                barPercentage: 0.8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: ctx =>
                            `R$ ${ctx.parsed.y.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2
                            })}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Gasto (R$)'
                    },
                    ticks: {
                        callback: v => 'R$ ' + v.toLocaleString('pt-BR')
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Mês'
                    }
                }
            }
        }
    });
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
