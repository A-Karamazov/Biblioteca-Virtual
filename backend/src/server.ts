import express from "express";
import path from "path";
import { Biblioteca } from "./models/Biblioteca";
import { Livro, StatusLivro } from "./models/Livro";
import { carregarDados, salvarDados } from "./database";

const app = express();
const PORTA = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "..", "frontend")));

// instância única de Biblioteca compartilhada
const biblioteca = new Biblioteca();
biblioteca.carregarDeJson(carregarDados());

function persistir(): void {
    salvarDados(biblioteca.exportarParaJson());
}

// ===== Rotas da API, todas sob /api/livros =====

// GET /api/livros            -> lista todos
// GET /api/livros?busca=xxx  -> lista filtrados por título, autor ou categoria
app.get("/api/livros", (req, res) => {
    const termo = typeof req.query.busca === "string" ? req.query.busca : "";
    const resultado = termo
        ? biblioteca.buscarPorTermo(termo)
        : biblioteca.listarLivros();

    res.json(resultado.map(livro => livro.converterParaJson()));
});

// GET /api/livros/:id -> retorna um livro específico 
app.get("/api/livros/:id", (req, res) => {
    const id = Number(req.params.id);
    const livro = biblioteca.buscarLivro(id);

    if (!livro) {
        res.status(404).json({ erro: "Livro não encontrado" });
        return;
    }

    res.json(livro.converterParaJson());
});

// POST /api/livros 
app.post("/api/livros", (req, res) => {
    const { nome, autor, tema, status, editora, categoria, link, observacoes } = req.body;

    if (!nome || !autor) {
        res.status(400).json({ erro: "Título e autor são obrigatórios" });
        return;
    }

    const novoId = biblioteca.proximoId();
    const statusValido: StatusLivro = ["nao-lido", "lendo", "lido"].includes(status)
        ? status
        : "nao-lido";

    const novoLivro = new Livro(novoId, nome, autor, tema ?? "", statusValido, editora, categoria, link, observacoes);
    biblioteca.adicionarLivro(novoLivro);
    persistir();

    res.status(201).json(novoLivro.converterParaJson());
});

// PUT /api/livros/:id 
app.put("/api/livros/:id", (req, res) => {
    const id = Number(req.params.id);
    const livroAtualizado = biblioteca.atualizarLivro(id, req.body);

    if (!livroAtualizado) {
        res.status(404).json({ erro: "Livro não encontrado" });
        return;
    }

    persistir();
    res.json(livroAtualizado.converterParaJson());
});

// DELETE /api/livros/:id 
app.delete("/api/livros/:id", (req, res) => {
    const id = Number(req.params.id);
    const removido = biblioteca.removerLivro(id);

    if (!removido) {
        res.status(404).json({ erro: "Livro não encontrado" });
        return;
    }

    persistir();
    res.status(204).send();
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
