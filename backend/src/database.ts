import fs from "fs";
import path from "path";
import { LivroJSON } from "./models/Livro";

const CAMINHO_DB = path.join(process.cwd(), "data", "db.json");

export function carregarDados(): LivroJSON[] {
    // Se o arquivo ainda não existir (primeira execução), cria um vazio
    if (!fs.existsSync(CAMINHO_DB)) {
        fs.writeFileSync(CAMINHO_DB, "[]", "utf-8");
        return [];
    }

    const conteudo = fs.readFileSync(CAMINHO_DB, "utf-8");
    return JSON.parse(conteudo) as LivroJSON[];
}

export function salvarDados(livros: LivroJSON[]): void {
    fs.writeFileSync(CAMINHO_DB, JSON.stringify(livros, null, 2), "utf-8");
}
