import { AuthService } from '../model/AuthService.js';

export class FinanceController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.usuarioLogado = null;
    }

    init() {

// Localize onde você adicionou o btnPerfil e mude para:
const btnPerfil = document.getElementById('btn-perfil');

if (btnPerfil) {
    btnPerfil.addEventListener('click', () => {
        window.location.href = "perfil.html";
    });
}
    // ... (mantenha os códigos anteriores de observarEstado e Login)

    // Evento para abrir o formulário de cadastro
    document.getElementById('btn-abrir-cadastro').addEventListener('click', () => {
        document.getElementById('modal-cadastro').style.display = 'block';
        document.getElementById('btn-abrir-cadastro').style.display = 'none';
    });

    // Evento para cancelar/fechar o formulário
    document.getElementById('btn-cancelar').addEventListener('click', () => {
        document.getElementById('modal-cadastro').style.display = 'none';
        document.getElementById('btn-abrir-cadastro').style.display = 'block';
    });



        AuthService.observarEstado((user) => {
            if (user) {
                this.usuarioLogado = user;
                document.getElementById('auth-container').style.display = 'none';
                document.getElementById('app-container').style.display = 'block';
                this.carregarContas();
            } else {
                this.usuarioLogado = null;
                document.getElementById('auth-container').style.display = 'block';
                document.getElementById('app-container').style.display = 'none';
            }
        });

        // Eventos de Login/Cadastro
        document.getElementById('btn-login').addEventListener('click', () => {
            const email = document.getElementById('login-email').value;
            const senha = document.getElementById('login-senha').value;
            AuthService.login(email, senha).catch(err => alert(err.message));
        });

        document.getElementById('btn-cadastrar').addEventListener('click', () => {
            const email = document.getElementById('login-email').value;
            const senha = document.getElementById('login-senha').value;
            AuthService.cadastrar(email, senha).catch(err => alert(err.message));
        });

        document.getElementById('btn-sair').addEventListener('click', () => AuthService.logout());

        // --- CORREÇÃO: OUVINTE DO BOTÃO SALVAR ---
        const btnSalvar = document.getElementById('btn-salvar');
        if (btnSalvar) {
            btnSalvar.addEventListener('click', (e) => {
                e.preventDefault(); 
                this.handleSalvarConta();
            });
        }
    }

    async handleSalvarConta() {
        if (!this.usuarioLogado) return;
        const dados = this.view.getFormData();
        
        if (!dados.banco || !dados.valor) {
            alert("Preencha Banco e Valor!");
            return;
        }

        try {
            await this.model.salvarConta(dados, this.usuarioLogado.uid);
            this.view.limparFormulario();
            await this.carregarContas(); // Recarrega a lista após salvar
        } catch (error) {
            console.error("Erro ao salvar:", error);
        }
    }

    async carregarContas() {
        if (!this.usuarioLogado) return;
        const contas = await this.model.buscarContas(this.usuarioLogado.uid);
        this.view.renderizarContas(contas);
    }
}