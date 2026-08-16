export type StatusLivro = "nao-lido" | "lendo" | "lido";

export interface LivroJSON {
    id: number;
    nome: string;
    autor: string;
    tema: string;
    status: StatusLivro;
    editora?: string;
    categoria?: string;
    link?: string;
    observacoes?: string;
}

export class Livro {

    constructor(
        public readonly id: number,
        public nome: string,
        public autor: string,
        public tema: string,
        public status: StatusLivro = "nao-lido",
        public editora?: string,
        public categoria?: string,
        public link?: string,
        public observacoes?: string
    ) {}

    atualizarDados(dados: Partial<LivroJSON>): void {
        if (dados.nome !== undefined) this.nome = dados.nome;
        if (dados.autor !== undefined) this.autor = dados.autor;
        if (dados.tema !== undefined) this.tema = dados.tema;
        if (dados.status !== undefined) this.status = dados.status;
        if (dados.editora !== undefined) this.editora = dados.editora;
        if (dados.categoria !== undefined) this.categoria = dados.categoria;
        if (dados.link !== undefined) this.link = dados.link;
        if (dados.observacoes !== undefined) this.observacoes = dados.observacoes;
    }

    mudarStatus(novoStatus: StatusLivro): void {
        this.status = novoStatus;
    }

    converterParaJson(): LivroJSON {
        return {
            id: this.id,
            nome: this.nome,
            autor: this.autor,
            tema: this.tema,
            status: this.status,
            editora: this.editora,
            categoria: this.categoria,
            link: this.link,
            observacoes: this.observacoes
        };
    }

    static apartirDeJson(dados: LivroJSON): Livro {
        return new Livro(
            dados.id,
            dados.nome,
            dados.autor,
            dados.tema,
            dados.status,
            dados.editora,
            dados.categoria,
            dados.link,
            dados.observacoes
        );
    }
}
