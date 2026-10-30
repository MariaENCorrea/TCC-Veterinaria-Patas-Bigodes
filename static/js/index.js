
/* ==========================================
   PATAS & BIGODES
   JavaScript - Página Inicial
========================================== */

"use strict";

/* ==========================================
   INICIALIZAÇÃO
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    iniciarAnimacoes();
    atualizarAno();
    iniciarRolagemSuave();
    verificarImagens();

});


/* ==========================================
   ANIMAÇÕES AO ROLAR A PÁGINA
========================================== */

function iniciarAnimacoes() {

    const elementos = document.querySelectorAll(
        ".card-clinica, .titulo-localizacao, .mapa-container, .endereco"
    );

    // Verifica suporte ao Intersection Observer
    if (!("IntersectionObserver" in window)) {
        return;
    }

    const observador = new IntersectionObserver((entradas, observer) => {

        entradas.forEach((entrada) => {

            if (entrada.isIntersecting) {

                entrada.target.classList.add("is-visible");

                observer.unobserve(entrada.target);

            }

        });

    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    });

    elementos.forEach((elemento) => {

        elemento.classList.add("reveal");

        observador.observe(elemento);

    });

}


/* ==========================================
   ATUALIZAÇÃO AUTOMÁTICA DO ANO
========================================== */

function atualizarAno() {

    const elementoAno = document.querySelector("#ano");

    if (!elementoAno) {
        return;
    }

    elementoAno.textContent = new Date().getFullYear();

}


/* ==========================================
   ROLAGEM SUAVE
========================================== */

function iniciarRolagemSuave() {

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {

        link.addEventListener("click", (evento) => {

            const destino = link.getAttribute("href");

            if (!destino || destino === "#") {
                return;
            }

            const secao = document.querySelector(destino);

            if (!secao) {
                return;
            }

            evento.preventDefault();

            secao.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });

        });

    });

}


/* ==========================================
   VERIFICAÇÃO DAS IMAGENS
========================================== */

function verificarImagens() {

    const imagens = document.querySelectorAll("img");

    imagens.forEach((imagem) => {

        imagem.addEventListener("error", () => {

            console.warn(
                "Não foi possível carregar a imagem:",
                imagem.getAttribute("src")
            );

            imagem.classList.add("imagem-indisponivel");

        });

    });

}
