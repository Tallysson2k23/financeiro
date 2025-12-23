import { AuthService } from '../model/AuthService.js';

export class FinanceController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.usuarioLogado = null;
    }

    init() {
        // --- NAVEGAÇÃO E PERFIL ---
        const btnPerfil = document.getElementById('btn-perfil');
        if (btnPerfil) {
            btnPerfil.addEventListener('click', () => {
                window.location.href = "perfil.html";
            });
        }

        // --- CONTROLE DO MODAL DE CADASTRO ---
        // Ajustado para o novo ID 'btn-abrir-modal' que colocamos no HTML
        const btnAbrirModal = document.getElementById('btn-abrir-modal');
        if (btnAbrirModal) {
            btnAbrirModal.addEventListener('click', () => {
                document.getElementById('modal-cadastro').style.display = 'flex';
            });
        }

        const btnCancelar = document.getElementById('btn-cancelar');
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => {
                document.getElementById('modal-cadastro').style.display = 'none';
            });
        }

        // --- AUTENTICAÇÃO ---
        AuthService.observarEstado((user) => {
            if (user) {
                this.usuarioLogado = user;
                document.getElementById('auth-container').style.display = 'none';
                document.getElementById('app-container').style.display = 'block';
                this.carregarContas();
            } else {
                this.usuarioLogado = null;
                document.getElementById('auth-container').style.display = 'flex';
                document.getElementById('app-container').style.display = 'none';
            }
        });

        // Eventos de Login
        document.getElementById('btn-login').addEventListener('click', () => {
            const email = document.getElementById('login-email').value;
            const senha = document.getElementById('login-senha').value;
            AuthService.login(email, senha).catch(err => alert("Erro ao entrar: " + err.message));
        });

        // Evento de Cadastro (Ajustado para o ID btn-ir-para-cadastro)
        document.getElementById('btn-ir-para-cadastro').addEventListener('click', () => {
            const email = document.getElementById('login-email').value;
            const senha = document.getElementById('login-senha').value;
            if(!email || !senha) return alert("Preencha email e senha para cadastrar");
            AuthService.cadastrar(email, senha).catch(err => alert("Erro ao cadastrar: " + err.message));
        });

        document.getElementById('btn-sair').addEventListener('click', () => AuthService.logout());

        // --- SALVAR NOVA CONTA ---
        const btnSalvar = document.getElementById('btn-salvar');
        if (btnSalvar) {
            btnSalvar.addEventListener('click', (e) => {
                e.preventDefault(); 
                this.handleSalvarConta();
            });
        }

        // Torna o controller acessível globalmente para os botões "Pagar" dentro dos cards
        window.controller = this;
    }

    async handleSalvarConta() {
        if (!this.usuarioLogado) return;
        const dados = this.view.getFormData();
        
        if (!dados.banco || !dados.valor) {
            alert("Preencha Banco e Valor!");
            return;
        }

        try {
            // Adicionamos o status 'paga: false' por padrão em novas contas
            const novaConta = { ...dados, paga: false };
            await this.model.salvarConta(novaConta, this.usuarioLogado.uid);
            
            document.getElementById('modal-cadastro').style.display = 'none';
            this.view.limparFormulario();
            await this.carregarContas(); 
        } catch (error) {
            console.error("Erro ao salvar:", error);
        }
    }

    async carregarContas() {
        if (!this.usuarioLogado) return;
        const contas = await this.model.buscarContas(this.usuarioLogado.uid);
        
        // Atualiza a lista visual
        this.view.renderizarContas(contas);
        
        // Atualiza os valores de Devedor e Restante
        this.atualizarResumo(contas);
    }

 async darBaixa(id) {
    try {
        // 1. Busca a lista atual de contas para saber o status desta conta específica
        const contas = await this.model.buscarContas(this.usuarioLogado.uid);
        const contaAlvo = contas.find(c => c.id === id);

        // 2. Se a conta já estiver Paga, pergunta antes de desfazer
        if (contaAlvo && contaAlvo.paga) {
            const confirmar = confirm(`Deseja realmente desfazer o pagamento de "${contaAlvo.banco}"?`);
            if (!confirmar) return; // Se o usuário cancelar, para aqui.
        }

        // 3. Se não estava paga (ou se o usuário confirmou), alterna o status
        await this.model.alternarStatusPagamento(id);
        
        // 4. Atualiza a tela e o resumo financeiro
        await this.carregarContas(); 

    } catch (error) {
        console.error("Erro ao processar alteração:", error);
        alert("Não foi possível atualizar o status.");
    }
}

    atualizarResumo(contas) {
        let devedor = 0;
        let pago = 0;

        contas.forEach(conta => {
            const valor = parseFloat(conta.valor) || 0;
            if (conta.paga === true) {
                pago += valor;
            } else {
                devedor += valor;
            }
        });

        document.getElementById('total-devedor').innerText = 
            `R$ ${devedor.toLocaleString('pt-br', {minimumFractionDigits: 2})}`;
        document.getElementById('total-restante').innerText = 
            `R$ ${pago.toLocaleString('pt-br', {minimumFractionDigits: 2})}`;
    }
}