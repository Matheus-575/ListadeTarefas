import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { log } from "console";


const qst = readline.createInterface({ input, output });
const API_URL = "http://localhost:3000/tarefas";

function limparTela(){
  console.clear();
}

const lista = [
  "1 - Adicionar tarefa",
  "2 - Listar tarefas",
  "3 - Completar tarefa",
  "4 - Editar tarefa",
  "5 - Remover tarefa",
  "6 - sair"
];

const menuTexto =
  "\nOlá! Seja bem-vindo(a) ao 2Do! Digite o que deseja fazer?\n" +
  lista.join("\n") +
  "\n";

//Func para adicionar tarefas
async function adicionarTarefa() {
  const titulo = await qst.question("Digite o título da tarefa: ")
  const descricao = await qst.question("Descreva a tarefa: ")

  const resposta = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, descricao}),
  })
  
  const dados = await resposta.json()

  if (!resposta.ok) {
    log(`Erro: ${dados.error}\n`)
    return;
  }
  log(`Tarefa "${dados.titulo}" adicionada com sucesso!\n`)
}

//Func para listar tarefas
async function listarTarefas() {
  const resposta = await fetch(API_URL)
  const tarefas = await resposta.json()
  
  if (tarefas.length === 0){
    log("Nenhuma tarefa cadastrada por enquanto...\n")
    return
  }

  log("\nTarefas cadastradas: \n")
  tarefas.forEach((tarf) => {
    const status = tarf.completada ? "[X]" : "[ ]"
    log(`${status} #${tarf.id} - ${tarf.titulo} - ${tarf.descricao || "sem descrição informada"}`)
  })
  log("")
}

//Func para mudar status das tarefas
async function completarTarefa(){
  const id = await qst.question("Digite o ID da tarefa realizada: ")
  const resposta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completada: true })
  })
  const dados = await resposta.json()

  if(!resposta.ok){
    log(`Erro: ${dados.error}\n`)
    return
  }
  log(`${dados.mensagem}\n`)
}

//Func para remover as tarefas
async function removerTarefa(){
  const id = await qst.question("Digite o ID da tarefa que deseja remover: ")
  const resposta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  })
  const dados = await resposta.json()
  
  if(!resposta.ok){
    log(`Erro: ${dados.error}\n`)
    return
  }
  log(`${dados.mensagem}\n`)
}

//Func para editar as tarefas
async function editarTarefa(){
  const id = await qst.question("Digite o ID da tarefa que será editada: ")
  const titulo = await qst.question("Digite o novo título da tarefa: (Deixe em branco para não alterar)")
  const descricao = await qst.question("Digite a nova descrição da tarefa: (Deixe em branco para não alterar)")

const dadosAtualizados = {}
if(titulo) dadosAtualizados.titulo = titulo
if(descricao) dadosAtualizados.descricao = descricao

const resposta = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAtualizados)
})

const resultado = await resposta.json()

if(!resposta.ok){
  log(`Erro: ${resultado.error}\n`)
  return
}
log(`${resultado.mensagem}\n`)
}


//Func do menu principal
async function menu() {
  let rodando = true;

  while (rodando) {
    const resposta = await qst.question(menuTexto);

    switch (resposta.trim()) {
      case "1":
        limparTela()
        await adicionarTarefa();
        break;
      case "2":
        limparTela()
        await listarTarefas();
        break;
      case "3":
        limparTela()
        await listarTarefas()
        await completarTarefa();
        break;
      case "4":
        limparTela()
        await listarTarefas()
        await editarTarefa()
        break;
      case "5":
        limparTela()
        await listarTarefas()
        await removerTarefa()
        break;
      case "6":
        limparTela()
        log("Saindo do 2Do... Volte logo!\n")
        rodando = false;
        break;
        default:
          limparTela()
          log("Opção inválida... Digite uma opção válida.\n")
    }
  }
  qst.close();
}
menu();
