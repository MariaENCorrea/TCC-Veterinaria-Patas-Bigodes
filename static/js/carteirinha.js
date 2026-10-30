/* =========================================================
   PATAS & BIGODES
   JavaScript da Carteirinha do Animal
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // ELEMENTOS PRINCIPAIS
    // =====================================================

    const formCadastro = document.getElementById("formCadastro");

    const modalElemento = document.getElementById(
        "modalAtualizarCadastro"
    );

    const modalCadastro = modalElemento && window.bootstrap
        ? bootstrap.Modal.getOrCreateInstance(modalElemento)
        : null;

    const nomePet = document.getElementById("nomePet");
    const dataNascimentoPet = document.getElementById("dataNascimento");
    const tutorPet = document.getElementById("tutor");
    const corPet = document.getElementById("cor");
    const racaPet = document.getElementById("raca");

    const inputNomeAnimal = document.getElementById("inputNomeAnimal");
    const inputSexoAnimal = document.getElementById("inputSexoAnimal");
    const inputIdadeAnimal = document.getElementById("inputIdadeAnimal");
    const inputRaca = document.getElementById("inputRaca");

    const inputNomeProprietario = document.getElementById(
        "inputNomeProprietario"
    );

    const inputCpf = document.getElementById("inputCpf");
    const inputCelular = document.getElementById("inputCelular");
    const inputEmail = document.getElementById("inputEmail");
    const inputCidade = document.getElementById("inputCidade");
    const inputBairro = document.getElementById("inputBairro");

    // =====================================================
    // MENSAGENS
    // =====================================================

    function exibirMensagem(mensagem, tipo = "success") {

        let alerta = document.getElementById("mensagemCarteirinha");

        if (!alerta) {

            alerta = document.createElement("div");

            alerta.id = "mensagemCarteirinha";
            alerta.className = "alert";
            alerta.setAttribute("role", "alert");

            const main = document.querySelector("main");

            if (main) {
                main.prepend(alerta);
            } else {
                document.body.prepend(alerta);
            }
        }

        alerta.className = `alert alert - ${ tipo } `;
        alerta.textContent = mensagem;

        alerta.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

        clearTimeout(alerta.timer);

        alerta.timer = setTimeout(function () {
            alerta.remove();
        }, 5000);
    }

    // =====================================================
    // CALCULAR IDADE
    // =====================================================

    function calcularIdade(idade) {

        const nascimento = new Date(idade);

        if (Number.isNaN(nascimento.getTime())) {
            return "Não informada";
        }

        const hoje = new Date();

        let anos = hoje.getFullYear() - nascimento.getFullYear();

        let meses = hoje.getMonth() - nascimento.getMonth();

        if (
            meses < 0 ||
            (
                meses === 0 &&
                hoje.getDate() < nascimento.getDate()
            )
        ) {
            anos--;
        }

        if (anos < 0) {
            return "Data inválida";
        }

        if (anos === 0) {

            const mesesTotais =
                (hoje.getFullYear() - nascimento.getFullYear()) * 12 +
                hoje.getMonth() - nascimento.getMonth() -
                (hoje.getDate() < nascimento.getDate() ? 1 : 0);

            return `${ Math.max(0, mesesTotais) } mês(es)`;
        }

        return anos === 1 ? "1 ano" : `${ anos } anos`;
    }

    // =====================================================
    // FORMATAR DATA PARA EXIBIÇÃO
    // =====================================================

    function formatarData(data) {

        if (!data) {
            return "Não informada";
        }

        const partes = data.split("-");

        if (partes.length !== 3) {
            return data;
        }

        return `${ partes[2] } /${partes[1]}/${ partes[0] }`;
    }

    // =====================================================
    // MÁSCARA DE CPF
    // =====================================================

    if (inputCpf) {

        inputCpf.addEventListener("input", function () {

            let valor = this.value.replace(/\D/g, "");

            valor = valor.substring(0, 11);

            valor = valor.replace(
                /(\d{3})(\d)/,
                "$1.$2"
            );

            valor = valor.replace(
                /(\d{3})(\d)/,
                "$1.$2"
            );

            valor = valor.replace(
                /(\d{3})(\d{1,2})$/,
                "$1-$2"
            );

            this.value = valor;
        });
    }

    // =====================================================
    // MÁSCARA DE CELULAR
    // =====================================================

    if (inputCelular) {

        inputCelular.addEventListener("input", function () {

            let valor = this.value.replace(/\D/g, "");

            valor = valor.substring(0, 11);

            if (valor.length <= 10) {

                valor = valor.replace(
                    /^(\d{2})(\d)/,
                    "($1) $2"
                );

                valor = valor.replace(
                    /(\d{4})(\d)/,
                    "$1-$2"
                );

            } else {

                valor = valor.replace(
                    /^(\d{2})(\d)/,
                    "($1) $2"
                );

                valor = valor.replace(
                    /(\d{5})(\d)/,
                    "$1-$2"
                );
            }

            this.value = valor;
        });
    }

    // =====================================================
    // VALIDAR CPF
    // =====================================================

    function cpfValido(cpf) {

        cpf = cpf.replace(/\D/g, "");

        if (
            cpf.length !== 11 ||
            /^(\d)\1{10}$/.test(cpf)
        ) {
            return false;
        }

        for (let tamanho = 9; tamanho < 11; tamanho++) {

            let soma = 0;

            for (let i = 0; i < tamanho; i++) {
                soma += Number(cpf[i]) * ((tamanho + 1) - i);
            }

            let digito = (soma * 10) % 11;

            if (digito === 10) {
                digito = 0;
            }

            if (digito !== Number(cpf[tamanho])) {
                return false;
            }
        }

        return true;
    }

    // =====================================================
    // ABRIR MODAL E CARREGAR DADOS
    // =====================================================

    const botaoAbrirModal = document.querySelector(
        '[data-bs-target="#modalAtualizarCadastro"]'
    );

    if (botaoAbrirModal) {

        botaoAbrirModal.addEventListener("click", function () {

            if (!formCadastro) {
                return;
            }

            // Se os dados vierem do Thymeleaf, eles devem
            // estar preenchidos nos respectivos campos.

            if (nomePet && inputNomeAnimal && !inputNomeAnimal.value) {
                inputNomeAnimal.value = nomePet.textContent.trim();
            }

            if (racaPet && inputRaca && !inputRaca.value) {
                inputRaca.value = racaPet.textContent.trim();
            }

            if (tutorPet && inputNomeProprietario &&
                !inputNomeProprietario.value) {

                inputNomeProprietario.value =
                    tutorPet.textContent.trim();
            }
        });
    }

    // =====================================================
    // ATUALIZAR CADASTRO
    // =====================================================

    window.atualizarCadastro = function () {

        if (!formCadastro) {
            return;
        }

        // Validar os campos obrigatórios.

        if (!formCadastro.reportValidity()) {
            return;
        }

        // Validar CPF, caso preenchido.

        if (inputCpf && inputCpf.value.trim()) {

            if (!cpfValido(inputCpf.value)) {

                inputCpf.setCustomValidity(
                    "Informe um CPF válido."
                );

                inputCpf.reportValidity();

                inputCpf.setCustomValidity("");

                return;
            }
        }

        // Verificar se o formulário está conectado ao backend.
        // Quando houver action e method POST, os dados serão
        // enviados ao Spring Boot.

        const action = formCadastro.getAttribute("action");

        const metodo = (
            formCadastro.getAttribute("method") || "get"
        ).toLowerCase();

        if (action && metodo === "post") {

            formCadastro.requestSubmit();

            return;
        }

        // Sem backend configurado, atualizar apenas a interface.
        // Os dados não serão persistidos no banco de dados.

        const nome = inputNomeAnimal?.value.trim();
        const sexo = inputSexoAnimal?.value;
        const idade = inputIdadeAnimal?.value;
        const raca = inputRaca?.value.trim();
        const tutor = inputNomeProprietario?.value.trim();

        if (nomePet && nome) {
            nomePet.textContent = nome.toUpperCase();
        }

        if (racaPet && raca) {
            racaPet.textContent = raca;
        }

        if (tutorPet && tutor) {
            tutorPet.textContent = tutor;
        }

        // Atualizar a idade no título da página, se existir
        // um elemento específico para exibi-la.

        const elementoIdade = document.getElementById("idadePet");

        if (elementoIdade && idade !== undefined) {
            elementoIdade.textContent =
                idade === "1" ? "1 ano" : `${ idade } anos`;
        }

        // O sexo pode ser exibido em um elemento opcional.

        const elementoSexo = document.getElementById("sexoPet");

        if (elementoSexo && sexo) {
            elementoSexo.textContent = sexo;
        }

        // A idade do formulário não é uma data de nascimento.
        // Por isso, não alteramos a data da carteirinha usando
        // esse campo.

        if (modalCadastro) {
            modalCadastro.hide();
        }

        exibirMensagem(
            "Dados atualizados na página. Para salvar permanentemente, conecte o formulário ao backend.",
            "success"
        );
    };

    // =====================================================
    // FILTRAR HISTÓRICO MÉDICO
    // =====================================================

    const campoBuscaMedica = document.getElementById(
        "buscarAtualizacoes"
    );

    if (campoBuscaMedica) {

        campoBuscaMedica.addEventListener("input", function () {

            const termo = this.value
                .trim()
                .toLocaleLowerCase("pt-BR");

            const registros = document.querySelectorAll(
                ".atualizacao-item"
            );

            registros.forEach(function (registro) {

                const conteudo = registro.textContent
                    .toLocaleLowerCase("pt-BR");

                registro.hidden = !conteudo.includes(termo);
            });
        });
    }

    // =====================================================
    // FILTRAR VACINAS
    // =====================================================

    const campoBuscaVacinas = document.getElementById(
        "buscarVacinas"
    );

    if (campoBuscaVacinas) {

        campoBuscaVacinas.addEventListener("input", function () {

            const termo = this.value
                .trim()
                .toLocaleLowerCase("pt-BR");

            const registros = document.querySelectorAll(
                ".vacina-item"
            );

            registros.forEach(function (registro) {

                const conteudo = registro.textContent
                    .toLocaleLowerCase("pt-BR");

                registro.hidden = !conteudo.includes(termo);
            });
        });
    }

    // =====================================================
    // CONTADORES DOS REGISTROS
    // =====================================================

    function atualizarContadores() {

        const grupos = [
            {
                seletor: ".lista-atualizacoes .atualizacao-item",
                container: ".lista-atualizacoes"
            },
            {
                seletor: ".lista-vacinas .vacina-item",
                container: ".lista-vacinas"
            }
        ];

        grupos.forEach(function (grupo) {

            const container = document.querySelector(grupo.container);

            if (!container) {
                return;
            }

            const quantidade = container.querySelectorAll(
                grupo.seletor
            ).length;

            const secao = container.closest(".tab-pane");

            const contador = secao?.querySelector(".contador");

            if (contador) {

                contador.textContent = quantidade === 1
                    ? "1 registro"
                    : `${ quantidade } registros`;
            }
        });
    }

    atualizarContadores();

    // =====================================================
    // ATUALIZAR DATA DA ÚLTIMA MODIFICAÇÃO NA INTERFACE
    // =====================================================

    function atualizarDataLocal() {

        const elemento = document.querySelector(
            ".ultima-atualizacao span"
        );

        if (!elemento) {
            return;
        }

        const agora = new Date();

        const data = agora.toLocaleDateString("pt-BR");

        const hora = agora.toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

        elemento.textContent = `${ data }, às ${ hora } `;
    }

    // =====================================================
    // IMPRESSÃO DA CARTEIRINHA
    // =====================================================

    const botaoImprimir = document.querySelector(".btn-imprimir");

    if (botaoImprimir) {

        botaoImprimir.addEventListener("click", function () {

            window.print();
        });
    }

    // =====================================================
    // EVITAR ENVIO ACIDENTAL POR ENTER NO FORMULÁRIO
    // =====================================================

    if (formCadastro) {

        formCadastro.addEventListener("keydown", function (evento) {

            if (
                evento.key === "Enter" &&
                evento.target.tagName !== "TEXTAREA" &&
                evento.target.type !== "submit"
            ) {
                evento.preventDefault();
            }
        });
    }

});