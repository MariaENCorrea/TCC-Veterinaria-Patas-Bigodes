document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // ELEMENTOS DO FORMULÁRIO
    // =========================================

    const formularioAnimal = document.querySelectorAll(".formulario")[0];
    const formularioProprietario = document.querySelectorAll(".formulario")[1];
    const botaoCadastrar = document.querySelector(".btn-cadastrar");

    const nomeAnimal = document.getElementById("nomeAnimal");
    const idade = document.getElementById("idade");
    const especie = document.getElementById("especie");
    const raca = document.getElementById("raca");

    const proprietario = document.getElementById("proprietario");
    const cpf = document.getElementById("cpf");
    const rg = document.getElementById("rg");
    const numero = document.getElementById("numero");
    const email = document.getElementById("email");
    const cidade = document.getElementById("cidade");
    const bairro = document.getElementById("bairro");

    // =========================================
    // FUNÇÕES AUXILIARES
    // =========================================

    function somenteNumeros(valor) {
        return valor.replace(/\D/g, "");
    }

    function mostrarErro(campo, mensagem) {
        campo.classList.add("is-invalid");
        campo.classList.remove("is-valid");

        let mensagemErro = campo.nextElementSibling;

        if (!mensagemErro || !mensagemErro.classList.contains("invalid-feedback")) {
            mensagemErro = document.createElement("div");
            mensagemErro.className = "invalid-feedback";
            campo.insertAdjacentElement("afterend", mensagemErro);
        }

        mensagemErro.textContent = mensagem;
    }

    function mostrarSucesso(campo) {
        campo.classList.remove("is-invalid");
        campo.classList.add("is-valid");

        const mensagemErro = campo.nextElementSibling;

        if (mensagemErro && mensagemErro.classList.contains("invalid-feedback")) {
            mensagemErro.textContent = "";
        }
    }

    function limparValidacao(campo) {
        campo.classList.remove("is-invalid", "is-valid");

        const mensagemErro = campo.nextElementSibling;

        if (mensagemErro && mensagemErro.classList.contains("invalid-feedback")) {
            mensagemErro.textContent = "";
        }
    }

    function validarObrigatorio(campo, mensagem) {
        if (!campo.value.trim()) {
            mostrarErro(campo, mensagem);
            return false;
        }

        mostrarSucesso(campo);
        return true;
    }

    // =========================================
    // MÁSCARA DE CPF
    // =========================================

    cpf.addEventListener("input", function () {

        let valor = somenteNumeros(this.value).slice(0, 11);

        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        this.value = valor;
    });

    // =========================================
    // MÁSCARA DE CELULAR
    // =========================================

    numero.addEventListener("input", function () {

        let valor = somenteNumeros(this.value).slice(0, 11);

        if (valor.length > 10) {
            valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
        } else if (valor.length > 6) {
            valor = valor.replace(/^(\d{2})(\d{4})(\d{1,4}).*/, "($1) $2-$3");
        } else if (valor.length > 2) {
            valor = valor.replace(/^(\d{2})(\d+)/, "($1) $2");
        } else if (valor.length > 0) {
            valor = valor.replace(/^(\d+)/, "($1");
        }

        this.value = valor;
    });

    // =========================================
    // VALIDAÇÃO DE CPF
    // =========================================

    function validarCPF(valor) {

        const numeroCPF = somenteNumeros(valor);

        if (numeroCPF.length !== 11) {
            return false;
        }

        if (/^(\d)\1{10}$/.test(numeroCPF)) {
            return false;
        }

        let soma = 0;

        for (let i = 0; i < 9; i++) {
            soma += Number(numeroCPF[i]) * (10 - i);
        }

        let digito1 = (soma * 10) % 11;

        if (digito1 === 10) {
            digito1 = 0;
        }

        if (digito1 !== Number(numeroCPF[9])) {
            return false;
        }

        soma = 0;

        for (let i = 0; i < 10; i++) {
            soma += Number(numeroCPF[i]) * (11 - i);
        }

        let digito2 = (soma * 10) % 11;

        if (digito2 === 10) {
            digito2 = 0;
        }

        return digito2 === Number(numeroCPF[10]);
    }

    // =========================================
    // VALIDAÇÃO DO E-MAIL
    // =========================================

    function validarEmail(valor) {

        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return formatoEmail.test(valor);
    }

    // =========================================
    // VALIDAÇÃO DO CELULAR
    // =========================================

    function validarCelular(valor) {

        const telefone = somenteNumeros(valor);

        return telefone.length === 10 || telefone.length === 11;
    }

    // =========================================
    // VALIDAÇÃO DOS DADOS DO ANIMAL
    // =========================================

    function validarAnimal() {

        let valido = true;

        if (!validarObrigatorio(nomeAnimal, "Informe o nome do animal.")) {
            valido = false;
        }

        const sexoSelecionado = document.querySelector('input[name="sexo"]:checked');

        if (!sexoSelecionado) {
            alert("Selecione o sexo do animal.");
            valido = false;
        }

        if (idade.value.trim() !== "") {

            const idadeAnimal = Number(idade.value);

            if (!Number.isInteger(idadeAnimal) || idadeAnimal < 0) {
                mostrarErro(idade, "Informe uma idade válida.");
                valido = false;
            } else {
                mostrarSucesso(idade);
            }
        }

        if (!especie.value || especie.selectedIndex === 0) {
            mostrarErro(especie, "Selecione a espécie do animal.");
            valido = false;
        } else {
            mostrarSucesso(especie);
        }

        return valido;
    }

    // =========================================
    // VALIDAÇÃO DOS DADOS DO PROPRIETÁRIO
    // =========================================

    function validarProprietario() {

        let valido = true;

        if (!validarObrigatorio(proprietario, "Informe seu nome completo.")) {
            valido = false;
        }

        if (cpf.value.trim() !== "") {

            if (!validarCPF(cpf.value)) {
                mostrarErro(cpf, "Informe um CPF válido.");
                valido = false;
            } else {
                mostrarSucesso(cpf);
            }

        }

        if (rg.value.trim() === "") {
            mostrarErro(rg, "Informe o RG do proprietário.");
            valido = false;
        } else {
            mostrarSucesso(rg);
        }

        if (!validarObrigatorio(numero, "Informe seu número de celular.")) {
            valido = false;
        } else if (!validarCelular(numero.value)) {
            mostrarErro(numero, "Informe um celular com DDD válido.");
            valido = false;
        } else {
            mostrarSucesso(numero);
        }

        if (!validarObrigatorio(email, "Informe seu e-mail.")) {
            valido = false;
        } else if (!validarEmail(email.value.trim())) {
            mostrarErro(email, "Informe um endereço de e-mail válido.");
            valido = false;
        } else {
            mostrarSucesso(email);
        }

        if (!validarObrigatorio(cidade, "Informe sua cidade.")) {
            valido = false;
        }

        if (!validarObrigatorio(bairro, "Informe seu bairro.")) {
            valido = false;
        }

        return valido;
    }

    // =========================================
    // VALIDAÇÃO AO DIGITAR
    // =========================================

    document.querySelectorAll(".form-control, .form-select").forEach(function (campo) {

        campo.addEventListener("input", function () {
            limparValidacao(this);
        });

        campo.addEventListener("change", function () {
            limparValidacao(this);
        });

    });

    // =========================================
    // FINALIZAR CADASTRO
    // =========================================

    botaoCadastrar.addEventListener("click", function (evento) {

        evento.preventDefault();

        const animalValido = validarAnimal();
        const proprietarioValido = validarProprietario();

        if (!animalValido || !proprietarioValido) {

            const primeiroErro = document.querySelector(".is-invalid");

            if (primeiroErro) {
                primeiroErro.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                primeiroErro.focus();
            }

            return;
        }

        const confirmar = confirm(
            "Todos os dados foram preenchidos corretamente.\n\n" +
            "Deseja finalizar o cadastro?"
        );

        if (confirmar) {

            alert(
                "Validação concluída!\n\n" +
                "Para salvar os dados do proprietário e do animal, " +
                "é necessário conectar o formulário ao sistema de cadastro."
            );

        }

    });

});