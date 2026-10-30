/* =====================================================
   PATAS & BIGODES — JAVASCRIPT DA APRESENTAÇÃO
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. ANIMAÇÃO DOS ELEMENTOS AO ROLAR A PÁGINA
    ===================================================== */

    const elementosAnimados = document.querySelectorAll(
        ".card-principal, .card-recepcao, .beneficio, " +
        ".profissional, .agendamento, .info-item"
    );

    elementosAnimados.forEach(elemento => {
        elemento.classList.add("animacao-pendente");
    });

    if ("IntersectionObserver" in window) {

        const observador = new IntersectionObserver((entradas, observer) => {

            entradas.forEach(entrada => {

                if (entrada.isIntersecting) {

                    entrada.target.classList.add("visivel");

                    observer.unobserve(entrada.target);

                }

            });

        }, {
            threshold: 0.12
        });

        elementosAnimados.forEach(elemento => {
            observador.observe(elemento);
        });

    } else {

        elementosAnimados.forEach(elemento => {
            elemento.classList.add("visivel");
        });

    }


    /* =====================================================
       2. EFEITO NOS CARDS DE BENEFÍCIOS
    ===================================================== */

    const beneficios = document.querySelectorAll(".beneficio");

    beneficios.forEach(card => {

        card.addEventListener("mouseenter", () => {
            card.classList.add("beneficio-destaque");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("beneficio-destaque");
        });

    });


    /* =====================================================
       3. MENU ATIVO CONFORME A PÁGINA ATUAL
    ===================================================== */

    const linksMenu = document.querySelectorAll(".menu-link");

    const paginaAtual = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    linksMenu.forEach(link => {

        const destino = link.getAttribute("href");

        if (!destino) {
            return;
        }

        const paginaDestino = destino
            .split("/")
            .pop()
            .toLowerCase();

        if (paginaDestino === paginaAtual) {

            linksMenu.forEach(item => {
                item.classList.remove("ativo");
            });

            link.classList.add("ativo");

        }

    });


    /* =====================================================
       4. FECHAR MENU MOBILE APÓS CLICAR EM UM LINK
    ===================================================== */

    const menuPrincipal = document.getElementById("menuPrincipal");

    if (menuPrincipal && window.bootstrap) {

        const linksMobile = menuPrincipal.querySelectorAll(".menu-link");

        linksMobile.forEach(link => {

            link.addEventListener("click", () => {

                if (window.innerWidth < 992 &&
                    menuPrincipal.classList.contains("show")) {

                    const menu = bootstrap.Collapse.getOrCreateInstance(
                        menuPrincipal
                    );

                    menu.hide();

                }

            });

        });

    }


    /* =====================================================
       5. NAVEGAÇÃO SUAVE PARA ÂNCORAS
    ===================================================== */

    const linksInternos = document.querySelectorAll('a[href^="#"]');

    linksInternos.forEach(link => {

        link.addEventListener("click", evento => {

            const destino = link.getAttribute("href");

            if (!destino || destino === "#") {
                return;
            }

            const secao = document.querySelector(destino);

            if (secao) {

                evento.preventDefault();

                secao.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* =====================================================
       6. BOTÃO VOLTAR AO TOPO
    ===================================================== */

    const botaoTopo = document.createElement("button");

    botaoTopo.type = "button";
    botaoTopo.className = "botao-topo";
    botaoTopo.setAttribute("aria-label", "Voltar ao topo");
    botaoTopo.title = "Voltar ao topo";

    botaoTopo.innerHTML = '<i class="bi bi-arrow-up"></i>';

    document.body.appendChild(botaoTopo);

    const atualizarBotaoTopo = () => {

        botaoTopo.classList.toggle(
            "botao-topo-visivel",
            window.scrollY > 350
        );

    };

    window.addEventListener("scroll", atualizarBotaoTopo, {
        passive: true
    });

    atualizarBotaoTopo();

    botaoTopo.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    /* =====================================================
       7. ANO AUTOMÁTICO NO RODAPÉ
    ===================================================== */

    const copyright = document.querySelector(".footer-content p");

    if (copyright) {

        copyright.innerHTML = copyright.innerHTML.replace(
            /©\s*\d{4}/,
            `© ${new Date().getFullYear()}`
        );

    }


    /* =====================================================
       8. PROTEÇÃO CONTRA ERROS NAS IMAGENS
    ===================================================== */

    const imagens = document.querySelectorAll("img");

    imagens.forEach(imagem => {

        imagem.addEventListener("error", () => {

            imagem.classList.add("imagem-indisponivel");

            console.warn(
                "Não foi possível carregar a imagem:",
                imagem.getAttribute("src")
            );

        });

    });

});