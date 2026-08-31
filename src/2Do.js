import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { log } from "console";


const qst = readline.createInterface({ input, output });

const lista = [
  "1 - Adicionar tarefa",
  "2 - Listar tarefas",
  "3 - Remover tarefa",
  "4 - sair",
];

const menuTexto =
  "\nOlá! Seja bem-vindo(a) ao 2Do! Digite o que deseja fazer?\n" +
  lista.join("\n") +
  "\n";

async function menu() {
  let rodando = true;

  while (rodando) {
    const resposta = await qst.question(menuTexto);

    switch (resposta.trim()) {
      case "1":
        const add = await qst.question(
          "Digite a tarefa que deseja adicionar: ",
        );
        console.log(`Tarefa "${add}" adicionada com sucesso!\n`);
        break;
      case "2":
        log("Listando tarefas. . .");
        break;
      case "3":
        log("Removendo tarefa. . .");
        break;
      case "4":
        log("Saindo do programa. . .");
        rodando = false;
        break;
    }
  }
}

menu();
