import { Livro, LivroJSON } from "./Livro";

export class Biblioteca {

    private livros: Livro[] = [];

    adicionarLivro(livro: Livro): void {
        this.livros.push(livro);
    }

    removerLivro(id: number): boolean {
        const tamanhoAntes = this.livros.length;
        this.livros = this.livros.filter(livro => livro.id !== id);
        return this.livros.length < tamanhoAntes;
    }

    atualizarLivro(id: number, dados: Partial<LivroJSON>): Livro | undefined {
        const livro = this.buscarLivro(id);
        if (!livro) return undefined;

        livro.atualizarDados(dados);
        return livro;
    }

    buscarLivro(id: number): Livro | undefined {
        return this.livros.find(livro => livro.id === id);
    }

    buscarPorTermo(termo: string): Livro[] {
        const termoNormalizado = termo.trim().toLowerCase();
        if (termoNormalizado === "") return this.listarLivros();

        return this.livros.filter(livro =>
            livro.nome.toLowerCase().includes(termoNormalizado) ||
            livro.autor.toLowerCase().includes(termoNormalizado) ||
            (livro.categoria?.toLowerCase().includes(termoNormalizado) ?? false)
        );
    }

    listarLivros(): Livro[] {
        return [...this.livros];
    }

    // Gera o próximo id de livro disponível: maior id existente + 1 
    proximoId(): number {
        if (this.livros.length === 0) return 1;
        return Math.max(...this.livros.map(livro => livro.id)) + 1;
    }

    carregarDeJson(dadosSalvos: LivroJSON[]): void {
        this.livros = dadosSalvos.map(dados => Livro.apartirDeJson(dados));
    }

    exportarParaJson(): LivroJSON[] {
        return this.livros.map(livro => livro.converterParaJson());
    }
}
