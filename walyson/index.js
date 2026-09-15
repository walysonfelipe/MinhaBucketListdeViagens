/*
===========================================================
PROVA PRÁTICA DE JAVASCRIPT
Arquivo que deverá ser desenvolvido pelo aluno.
===========================================================

IMPORTANTE:
- Não altere os IDs existentes no index.html.
- As viagens deverão ser inseridas dentro de #listaViagens.
- Cada viagem deverá ser uma <tr> com a classe "viagem-item".
- Dentro da linha criada, utilize obrigatoriamente:

  .viagem-foto        -> célula que contém a imagem
  .viagem-pais        -> país/destino
  .viagem-data        -> data
  .viagem-descricao   -> descrição
  .viagem-status      -> "Já fui" ou "Quero ir"
  .btn-editar         -> botão de edição
  .btn-excluir        -> botão de exclusão

Isso permite que o sistema de correção automática identifique
o resultado gerado pelo seu programa.
*/

// Desenvolva sua solução abaixo.

const btnSalvar = document.querySelector("#btnSalvar");
const btnCancelar = document.querySelector("#btnCancelar");
const listaViagens = document.querySelector("#listaViagens");
const mensagemErro = document.querySelector("#mensagemErro");
const contadorViagens = document.querySelector("#contadorViagens");
const listaVazia = document.querySelector("#listaVazia");
let linhaEmEdicao = null;

const campoFoto = document.querySelector("#foto");
const grupoFoto = campoFoto.parentElement;
const labelFotoArquivo = document.createElement("label");
labelFotoArquivo.className = "form-label mt-2 mb-1 campo-foto-local-label";
labelFotoArquivo.htmlFor = "fotoArquivo";
labelFotoArquivo.textContent = "Ou escolha uma imagem do computador";

const fotoArquivo = document.createElement("input");
fotoArquivo.type = "file";
fotoArquivo.id = "fotoArquivo";
fotoArquivo.className = "form-control campo-foto-local";
fotoArquivo.accept = "image/*";

const botaoFotoLocal = document.createElement("button");
botaoFotoLocal.type = "button";
botaoFotoLocal.className = "btn btn-sm btn-outline-secondary botao-foto-local";
botaoFotoLocal.innerHTML = `${iconeRemix("System", "image-add-line")}<span>Adicionar foto do computador</span>`;

labelFotoArquivo.classList.add("d-none");
fotoArquivo.classList.add("d-none");
grupoFoto.append(botaoFotoLocal, labelFotoArquivo, fotoArquivo);

function iconeRemix(categoria, nome) {
  return `<i class="ri ri-${nome}" aria-hidden="true"></i>`;
}

btnSalvar.innerHTML = `${iconeRemix("System", "add-line")}<span>Adicionar viagem</span>`;
btnCancelar.innerHTML = `${iconeRemix("System", "close-line")}<span>Cancelar edição</span>`;

function adicionarIcone(elemento, icone) {
  if (!elemento) return;
  const texto = elemento.textContent.trim();
  elemento.innerHTML = `${iconeRemix("System", icone)}<span>${texto}</span>`;
}

function mostrarAlerta(mensagem, tipo = "success", icone = "check-line") {
  const alerta = document.createElement("div");
  alerta.className = `alerta-app alerta-${tipo}`;
  alerta.setAttribute("role", "status");

  alerta.innerHTML = `
    <span class="alerta-icone">${iconeRemix("System", icone)}</span>
    <span class="alerta-texto"></span>
    <button class="alerta-fechar" type="button" aria-label="Fechar alerta">×</button>
  `;
  alerta.querySelector(".alerta-texto").textContent = mensagem;

  document.body.appendChild(alerta);

  requestAnimationFrame(() => alerta.classList.add("alerta-visivel"));

  const remover = () => {
    alerta.classList.remove("alerta-visivel");
    setTimeout(() => alerta.remove(), 220);
  };

  alerta.querySelector(".alerta-fechar").addEventListener("click", remover);
  setTimeout(remover, 2800);
}

adicionarIcone(document.querySelector("header h1"), "flight-takeoff-line");
adicionarIcone(document.querySelector("form h2"), "add-circle-line");
adicionarIcone(document.querySelector("#listaViagens").closest(".card").querySelector("h2"), "map-2-line");
adicionarIcone(document.querySelector("label[for='pais']"), "earth-line");
adicionarIcone(document.querySelector("label[for='foto']"), "image-line");
adicionarIcone(document.querySelector("label[for='dataViagem']"), "calendar-line");
adicionarIcone(document.querySelector("label[for='descricao']"), "file-text-line");
adicionarIcone(document.querySelector("label[for='jaFui']"), "checkbox-circle-line");
adicionarIcone(document.querySelector("#listaVazia"), "flight-takeoff-line");

btnSalvar.addEventListener("click", function () {
  const pais = document.querySelector("#pais").value;
  const fotoInformada = document.querySelector("#foto").value;
  const arquivoSelecionado = document.querySelector("#fotoArquivo").files[0];
  const foto = arquivoSelecionado
    ? URL.createObjectURL(arquivoSelecionado)
    : fotoInformada;
  const dataViagem = document.querySelector("#dataViagem").value;
  const descricao = document.querySelector("#descricao").value;
  const jaFui = document.querySelector("#jaFui").checked;

  if (!pais.trim() || (!fotoInformada.trim() && !arquivoSelecionado) || !dataViagem.trim() || !descricao.trim()) {
    mensagemErro.classList.remove("d-none");
    return;
  }

  mensagemErro.classList.add("d-none");

  if (linhaEmEdicao) {
    linhaEmEdicao.classList.add("table-primary");
    linhaEmEdicao.querySelector(".viagem-foto img").src = foto;
    linhaEmEdicao.querySelector(".viagem-foto img").alt = pais;
    linhaEmEdicao.querySelector(".viagem-pais").textContent = pais;
    linhaEmEdicao.querySelector(".viagem-data").textContent = dataViagem;
    linhaEmEdicao.querySelector(".viagem-descricao").textContent = descricao;
    linhaEmEdicao.querySelector(".viagem-status").textContent = jaFui
      ? "Já fui"
      : "Quero ir";

    linhaEmEdicao = null;
    btnCancelar.classList.add("d-none");
    btnSalvar.innerHTML = `${iconeRemix("System", "add-line")}<span>Adicionar viagem</span>`;
    limparFormulario();
    mostrarAlerta("Viagem atualizada com sucesso!", "success", "edit-line");
    return;
  }

  const linha = document.createElement("tr");
  linha.className = "viagem-item align-middle";

  linha.innerHTML = `
    <td class="viagem-foto">
      <img class="img-fluid rounded shadow-sm" src="${foto}" alt="${pais}" width="100" loading="lazy">
    </td>
    <td class="viagem-pais">${pais}</td>
    <td class="viagem-data text-nowrap">${dataViagem}</td>
    <td class="viagem-descricao">${descricao}</td>
    <td class="viagem-status text-nowrap">${jaFui ? "Já fui" : "Quero ir"}</td>
    <td class="text-end">
      <button type="button" class="btn btn-sm btn-outline-primary btn-editar">
        ${iconeRemix("System", "edit-line")}<span>Editar</span>
      </button>
      <button type="button" class="btn btn-sm btn-outline-danger btn-excluir">
        ${iconeRemix("System", "delete-bin-line")}<span>Excluir</span>
      </button>
    </td>
  `;

  listaViagens.appendChild(linha);

  linha.querySelector(".btn-editar").addEventListener("click", function () {
    linhaEmEdicao = linha;

    document.querySelector("#pais").value = linha.querySelector(".viagem-pais").textContent;
    document.querySelector("#foto").value = linha.querySelector(".viagem-foto img").getAttribute("src");
    document.querySelector("#dataViagem").value = linha.querySelector(".viagem-data").textContent;
    document.querySelector("#descricao").value = linha.querySelector(".viagem-descricao").textContent;
    document.querySelector("#jaFui").checked =
      linha.querySelector(".viagem-status").textContent === "Já fui";

    btnCancelar.classList.remove("d-none");
    btnSalvar.innerHTML = `${iconeRemix("System", "check-line")}<span>Salvar edição</span>`;
  });

  linha.querySelector(".btn-excluir").addEventListener("click", function () {
    linha.remove();
    atualizarInterface();
    mostrarAlerta("Viagem excluída com sucesso!", "success", "delete-bin-line");
  });

  limparFormulario();
  atualizarInterface();
  mostrarAlerta("Viagem cadastrada com sucesso!", "success", "check-line");
});

function limparFormulario() {
  document.querySelector("#pais").value = "";
  document.querySelector("#foto").value = "";
  document.querySelector("#fotoArquivo").value = "";
  labelFotoArquivo.classList.add("d-none");
  fotoArquivo.classList.add("d-none");
  botaoFotoLocal.innerHTML = `${iconeRemix("System", "image-add-line")}<span>Adicionar foto do computador</span>`;
  document.querySelector("#dataViagem").value = "";
  document.querySelector("#descricao").value = "";
  document.querySelector("#jaFui").checked = false;
}

btnCancelar.addEventListener("click", function () {
  linhaEmEdicao = null;
  btnCancelar.classList.add("d-none");
  btnSalvar.innerHTML = `${iconeRemix("System", "add-line")}<span>Adicionar viagem</span>`;
  mensagemErro.classList.add("d-none");
  limparFormulario();
});

fotoArquivo.addEventListener("change", function () {
  if (fotoArquivo.files[0]) {
    campoFoto.value = "";
  }
});

botaoFotoLocal.addEventListener("click", function () {
  const escondido = fotoArquivo.classList.toggle("d-none");
  labelFotoArquivo.classList.toggle("d-none", escondido);

  botaoFotoLocal.innerHTML = escondido
    ? `${iconeRemix("System", "image-add-line")}<span>Adicionar foto do computador</span>`
    : `${iconeRemix("System", "eye-off-line")}<span>Ocultar opção de arquivo</span>`;
});

function atualizarInterface() {
  const quantidade = listaViagens.querySelectorAll(".viagem-item").length;

  contadorViagens.textContent = `${quantidade} viagem(ns)`;
  listaVazia.classList.toggle("d-none", quantidade > 0);
}
