class Livro {

    constructor(
        private idNum: number,
        public nome: string,
        public autor: string,
        public tema: string,
        public editora?: string,
        public categoria?: string,
        public link?: string,
        public observacoes?: string
    ) {}

    get id() {
        return this.idNum
    }

    atualizarDados () {
        
    }

    mudarStatus() {

    }

    converterParaJson() {

    }
}

class Bilbioteca {

    adicionarLivro(livro: Livro) {

    }

    removerLivro() {

    }

    atualizarLivro() {

    }

    buscarLivro() {

    }

    buscarPorTermo() {

    }

    listarLivros() {

    }
}