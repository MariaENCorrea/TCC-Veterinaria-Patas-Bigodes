
"use strict";

/* ==========================================
   PATAS & BIGODES
   JavaScript - Página de Horários
========================================== */


/* ==========================================
   CONFIGURAÇÕES DE ATENDIMENTO
========================================== */

const HORARIOS_CLINICA = {
    0: null, // Domingo: fechado

    1: { abertura: 9, fechamento: 20 }, // Segunda
    2: { abertura: 9, fechamento: 20 }, // Terça
    3: { abertura: 9, fechamento: 20 }, // Quarta
    4: { abertura: 9, fechamento: 20 }, // Quinta
    5: { abertura: 9, fechamento: 20 }, // Sexta

    6: { abertura: 9, fechamento: 13 } // Sábado
};


/* ==========================================
   ELEMENTOS DA PÁGINA
========================================== */

const elementoStatus = document.querySelector(".status");

const elementoProximo = document.querySelector(".proximo");

const cardsHorarios = document.querySelectorAll(".horarios .card");


/* ==========================================
   INICIALIZAÇÃO
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    atualizarStatus();
    destacarDiaAtual();
    atualizarAno();
    iniciarAnimacoes();

    // Atualiza o status a cada minuto.
    setInterval(atualizarStatus, 60000);

    // Atualiza quando o usuário retorna à página.
    document.addEventListener("visibilitychange", () => {

        if (!document.hidden) {
            atualizarStatus();
            destacarDiaAtual();
        }

    });

});


/* ==========================================
   ATUALIZAR STATUS DA CLÍNICA
========================================== */

function atualizarStatus() {

    if (!elementoStatus || !elementoProximo) {
        console.error("Elementos de status não encontrados.");
        return;
    }

    const agora = new Date();

    const diaAtual = agora.getDay();

    const horaAtual = agora.getHours();

    const minutoAtual = agora.getMinutes();

    const horarioHoje = HORARIOS_CLINICA[diaAtual];

    // Verifica se a clínica está aberta.
    const estaAberta = horarioHoje !== null &&
        horaAtual >= horarioHoje.abertura &&
        horaAtual < horarioHoje.fechamento;

    if (estaAberta) {

        mostrarStatusAberto(horarioHoje);

    } else {

        mostrarStatusFechado(agora);

    }

}


/* ==========================================
   CLÍNICA ABERTA
========================================== */

function mostrarStatusAberto(horario) {

    elementoStatus.classList.remove("fechado");

    elementoStatus.classList.add("aberto");

    elementoStatus.innerHTML = `
        <i class="bi bi-circle-fill"></i>
        ABERTO AGORA
    `;

    elementoProximo.textContent =
        `Estamos atendendo! Nosso expediente termina às ${formatarHora(horario.fechamento)}.`;

}


/* ==========================================
   CLÍNICA FECHADA
========================================== */

function mostrarStatusFechado(agora) {

    elementoStatus.classList.remove("aberto");

    elementoStatus.classList.add("fechado");

    elementoStatus.innerHTML = `
        <i class="bi bi-circle-fill"></i>
        FECHADO AGORA
    `;

    const proximoHorario = encontrarProximoAtendimento(agora);

    if (!proximoHorario) {

        elementoProximo.textContent =
            "Não há previsão de atendimento.";

        return;

    }

    const dataProximo = proximoHorario.data;

    const horarioProximo = proximoHorario.horario;

    const diaAtual = agora.getDate();

    const diaProximo = dataProximo.getDate();

    const mesmoDia = agora.getFullYear() === dataProximo.getFullYear() &&
        agora.getMonth() === dataProximo.getMonth() &&
        diaAtual === diaProximo;

    const diaSemana = dataProximo.toLocaleDateString("pt-BR", {
        weekday: "long"
    });

    const hora = formatarHora(horarioProximo.abertura);

    if (mesmoDia) {

        elementoProximo.textContent =
            `Próximo atendimento hoje às ${hora}.`;

    } else {

        elementoProximo.textContent =
            `Próximo atendimento: ${diaSemana} às ${hora}.`;

    }

}


/* ==========================================
   ENCONTRAR PRÓXIMO ATENDIMENTO
========================================== */

function encontrarProximoAtendimento(agora) {

    // Verifica os próximos sete dias.
    for (let i = 0; i <= 7; i++) {

        const dataVerificada = new Date(agora);

        dataVerificada.setDate(agora.getDate() + i);

        const diaSemana = dataVerificada.getDay();

        const horario = HORARIOS_CLINICA[diaSemana];

        // Ignora dias sem atendimento.
        if (!horario) {
            continue;
        }

        const horarioAbertura = new Date(dataVerificada);

        horarioAbertura.setHours(
            horario.abertura,
            0,
            0,
            0
        );

        // Retorna se ainda não chegou o horário de abertura.
        if (horarioAbertura > agora) {

            return {
                data: dataVerificada,
                horario: horario
            };

        }

    }

    return null;

}


/* ==========================================
   FORMATAR HORÁRIOS
========================================== */

function formatarHora(hora) {

    return `${String(hora).padStart(2, "0")}:00`;

}


/* ==========================================
   DESTACAR DIA ATUAL
========================================== */

function destacarDiaAtual() {

    const diaAtual = new Date().getDay();

    cardsHorarios.forEach((card) => {

        card.classList.remove("hoje");

        const diasCard = card.dataset.dias;

        if (!diasCard) {
            return;
        }

        const dias = diasCard.split(",").map(Number);

        if (dias.includes(diaAtual)) {

            card.classList.add("hoje");

        }

    });

}


/* ==========================================
   ATUALIZAR ANO DO RODAPÉ
========================================== */

function atualizarAno() {

    const elementoAno = document.querySelector("#ano");

    if (elementoAno) {

        elementoAno.textContent = new Date().getFullYear();

    }

}


/* ==========================================
   ANIMAÇÕES AO ROLAR A PÁGINA
========================================== */

function iniciarAnimacoes() {

    const elementos = document.querySelectorAll(
        ".cabecalho-pagina, .horarios .card, .status-area, .emergencia"
    );

    // Verifica suporte do navegador.
    if (!("IntersectionObserver" in window)) {
        return;
    }

    const observador = new IntersectionObserver((entradas, observer) => {

        entradas.forEach((entrada) => {

            if (entrada.isIntersecting) {

                entrada.target.classList.add("visivel");

                observer.unobserve(entrada.target);

            }

        });

    }, {
        threshold: 0.15
    });

    elementos.forEach((elemento) => {

        elemento.classList.add("animar");

        observador.observe(elemento);

    });

}
