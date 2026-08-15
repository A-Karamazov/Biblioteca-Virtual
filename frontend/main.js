// Rótulos legíveis pra cada valor de status guardado no banco
const ROTULOS_STATUS = {
    "nao-lido": "Não Lido",
    "lendo": "Lendo",
    "lido": "Lido"
};


// ===== Página index.html — listagem e busca =====
function inicializarListagem() {
    const corpoTabela = document.getElementById("corpo-tabela");
    const tabela = document.getElementById("tabela-livros");
    const mensagemVazia = document.getElementById("mensagem-vazia");
    const campoBusca = document.getElementById("campo-busca");
    const botaoBuscar = document.getElementById("botao-buscar");

    // Se os elementos da listagem não existem nesta página, não é o index.html
    if (!corpoTabela || !tabela || !mensagemVazia || !campoBusca) return;

    async function carregarLivros(termo = "") {
        const url = termo
            ? `/api/livros?busca=${encodeURIComponent(termo)}`
            : "/api/livros";

        const resposta = await fetch(url);
        const livros = await resposta.json();
        renderizarTabela(livros);
    }

    function renderizarTabela(livros) {
        corpoTabela.innerHTML = "";

        if (livros.length === 0) {
            tabela.hidden = true;
            mensagemVazia.hidden = false;
            return;
        }

        tabela.hidden = false;
        mensagemVazia.hidden = true;

        for (const livro of livros) {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${escaparHtml(livro.nome)}</td>
                <td>${escaparHtml(livro.autor)}</td>
                <td>${escaparHtml(livro.categoria ?? "-")}</td>
                <td>${ROTULOS_STATUS[livro.status]}</td>
                <td class="acoes">
                    <a href="newbook.html?id=${livro.id}">Editar</a>
                    <a data-id="${livro.id}" class="link-excluir">Excluir</a>
                </td>
            `;

            corpoTabela.appendChild(linha);
        }

        // Liga o clique de cada botão "Excluir" recém-criado
        corpoTabela.querySelectorAll(".link-excluir").forEach(link => {
            link.addEventListener("click", async () => {
                const id = Number(link.dataset.id);
                const confirmar = confirm("Tem certeza que deseja excluir este livro?");
                if (!confirmar) return;

                await fetch(`/api/livros/${id}`, { method: "DELETE" });
                carregarLivros(campoBusca.value);
            });
        });
    }

    // Evita que texto do usuário (título/autor) seja interpretado como HTML
    function escaparHtml(texto) {
        const div = document.createElement("div");
        div.textContent = texto;
        return div.innerHTML;
    }

    botaoBuscar?.addEventListener("click", () => carregarLivros(campoBusca.value));
    campoBusca.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") carregarLivros(campoBusca.value);
    });

    carregarLivros();
}

// ===== Página newbook.html — criar ou editar livro =====
function inicializarFormulario() {
    const formulario = document.getElementById("new-book-form");
    if (!formulario) return;

    const inputNome = document.getElementById("input-nome");
    const inputAutor = document.getElementById("input-autor");
    const inputEditora = document.getElementById("input-editora");
    const selectCategoria = document.getElementById("categorias");
    const inputTema = document.getElementById("input-tema");
    const inputLink = document.getElementById("link-livro");
    const selectStatus = document.getElementById("status");
    const inputObservacoes = document.getElementById("observacoes");
    const tituloFormulario = document.getElementById("titulo-formulario");
    const botaoSalvar = document.getElementById("botao-salvar");

    // Se veio um ?id=... na URL, estamos editando um livro existente
    const parametros = new URLSearchParams(window.location.search);
    const idEdicao = parametros.get("id");

    async function preencherParaEdicao(id) {
        const resposta = await fetch(`/api/livros/${id}`);
        if (!resposta.ok) return;

        const livro = await resposta.json();
        inputNome.value = livro.nome;
        inputAutor.value = livro.autor;
        inputEditora.value = livro.editora ?? "";
        selectCategoria.value = livro.categoria ?? "";
        inputTema.value = livro.tema ?? "";
        inputLink.value = livro.link ?? "";
        selectStatus.value = livro.status;
        inputObservacoes.value = livro.observacoes ?? "";

        if (tituloFormulario) tituloFormulario.textContent = "Editar Livro";
        if (botaoSalvar) botaoSalvar.textContent = "Salvar Alterações";
    }

    if (idEdicao) {
        preencherParaEdicao(idEdicao);
    }

    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const dados = {
            nome: inputNome.value.trim(),
            autor: inputAutor.value.trim(),
            editora: inputEditora.value.trim() || undefined,
            categoria: selectCategoria.value || undefined,
            tema: inputTema.value.trim(),
            link: inputLink.value.trim() || undefined,
            status: selectStatus.value,
            observacoes: inputObservacoes.value.trim() || undefined
        };

        const url = idEdicao ? `/api/livros/${idEdicao}` : "/api/livros";
        const metodo = idEdicao ? "PUT" : "POST";

        const resposta = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            alert("Não foi possível salvar o livro. Verifique os campos obrigatórios.");
            return;
        }

        window.location.href = "index.html";
    });
}

// ===== Ponto de entrada =====
document.addEventListener("DOMContentLoaded", () => {
    inicializarListagem();
    inicializarFormulario();
});
