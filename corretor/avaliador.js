const iframe = document.querySelector("#appAluno");
const btnExecutar = document.querySelector("#btnExecutar");
const resultados = document.querySelector("#resultados");
const nota = document.querySelector("#nota");
const resumo = document.querySelector("#resumo");

btnExecutar.addEventListener("click", executarCorrecao);


// ------------------------------------------------------------
// CONFIGURAÇÃO DAS QUESTÕES / PONTUAÇÕES
// ------------------------------------------------------------

const testes = [
  {
    nome: "1. Cadastro de uma viagem",
    pontos: 2.0,
    executar: testarCadastro
  },
  {
    nome: "2. Exibição correta dos dados",
    pontos: 1.5,
    executar: testarConteudoCadastro
  },
  {
    nome: "3. Status 'Já fui' / 'Quero ir'",
    pontos: 1.0,
    executar: testarStatus
  },
  {
    nome: "4. Limpeza do formulário após cadastro",
    pontos: 0.5,
    executar: testarLimpezaFormulario
  },
  {
    nome: "5. Edição de viagem sem duplicação",
    pontos: 2.0,
    executar: testarEdicao
  },
  {
    nome: "6. Exclusão de viagem",
    pontos: 1.5,
    executar: testarExclusao
  },
  {
    nome: "7. Validação de campos obrigatórios",
    pontos: 1.0,
    executar: testarValidacao
  },
  {
    nome: "8. Contador e estado da lista",
    pontos: 0.5,
    executar: testarContador
  }
];


// ------------------------------------------------------------
// EXECUÇÃO GERAL
// ------------------------------------------------------------

async function executarCorrecao() {

  resultados.innerHTML = "";
  nota.textContent = "-- / 10,0";
  resumo.textContent = "Executando testes...";

  // Recarrega a aplicação para começar sempre do zero.
  iframe.src = iframe.src;

  await esperarCarregamentoIframe();

  let total = 0;
  let aprovados = 0;

  for (const teste of testes) {

    let retorno;

    try {
      retorno = await teste.executar();
    } catch (erro) {
      retorno = {
        ok: false,
        motivo: "O teste não conseguiu ser concluído.",
        detalhe: erro.message
      };
    }

    if (retorno.ok) {
      total += teste.pontos;
      aprovados++;
    }

    mostrarResultado(teste, retorno);
  }

  nota.textContent = `${total.toFixed(1).replace(".", ",")} / 10,0`;
  resumo.textContent =
    `${aprovados} de ${testes.length} critérios foram atendidos.`;
}


// ------------------------------------------------------------
// UTILITÁRIOS
// ------------------------------------------------------------

function doc() {
  return iframe.contentDocument;
}

function win() {
  return iframe.contentWindow;
}

function esperarCarregamentoIframe() {
  return new Promise((resolve) => {

    // Caso já esteja carregado após alteração do src.
    iframe.onload = function () {
      setTimeout(resolve, 150);
    };
  });
}

function esperar(ms = 30) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function obter(selector) {
  const elemento = doc().querySelector(selector);

  if (!elemento) {
    throw new Error(`Elemento obrigatório não encontrado: ${selector}`);
  }

  return elemento;
}

function preencherFormulario({
  pais,
  foto,
  data,
  descricao,
  jaFui
}) {
  obter("#pais").value = pais;
  obter("#foto").value = foto;
  obter("#dataViagem").value = data;
  obter("#descricao").value = descricao;
  obter("#jaFui").checked = jaFui;
}

function clicar(selector) {
  obter(selector).click();
}

function linhas() {
  return [...doc().querySelectorAll(".viagem-item")];
}

function texto(selector, raiz = doc()) {
  const elemento = raiz.querySelector(selector);

  if (!elemento) {
    throw new Error(`Elemento obrigatório não encontrado: ${selector}`);
  }

  return elemento.textContent.trim();
}

function mostrarResultado(teste, retorno) {

  const classe = retorno.ok ? "resultado-ok" : "resultado-erro";
  const badge = retorno.ok
    ? `<span class="badge text-bg-success">+${teste.pontos.toFixed(1)}</span>`
    : `<span class="badge text-bg-danger">+0,0 de ${teste.pontos.toFixed(1)}</span>`;

  const card = document.createElement("div");
  card.className = `card shadow-sm mb-3 ${classe}`;

  card.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between gap-3">
        <div>
          <h3 class="h6 mb-1">${teste.nome}</h3>
          <p class="mb-1">${retorno.motivo}</p>
          ${
            retorno.detalhe
              ? `<small class="text-muted">${retorno.detalhe}</small>`
              : ""
          }
        </div>
        <div>${badge}</div>
      </div>
    </div>
  `;

  resultados.appendChild(card);
}


// ------------------------------------------------------------
// TESTES
// ------------------------------------------------------------

async function testarCadastro() {

  preencherFormulario({
    pais: "Japão",
    foto: "https://example.com/japao.jpg",
    data: "2027-04-10",
    descricao: "Conhecer Tóquio",
    jaFui: false
  });

  clicar("#btnSalvar");
  await esperar();

  const quantidade = linhas().length;

  if (quantidade !== 1) {
    return {
      ok: false,
      motivo: "A viagem não foi adicionada à lista.",
      detalhe:
        `Era esperada 1 linha com a classe .viagem-item, mas foram encontradas ${quantidade}.`
    };
  }

  const linha = linhas()[0];

  const obrigatorios = [
    ".viagem-foto",
    ".viagem-pais",
    ".viagem-data",
    ".viagem-descricao",
    ".viagem-status",
    ".btn-editar",
    ".btn-excluir"
  ];

  for (const seletor of obrigatorios) {
    if (!linha.querySelector(seletor)) {
      return {
        ok: false,
        motivo: "A linha foi criada, mas sua estrutura está incompleta.",
        detalhe: `Não foi encontrado o elemento obrigatório ${seletor}.`
      };
    }
  }

  return {
    ok: true,
    motivo: "A viagem foi cadastrada e a estrutura obrigatória foi criada."
  };
}


async function testarConteudoCadastro() {

  const lista = linhas();

  if (lista.length === 0) {
    return {
      ok: false,
      motivo: "Não existe uma viagem cadastrada para verificar.",
      detalhe: "Este critério depende do cadastro realizado anteriormente."
    };
  }

  const linha = lista[0];

  const verificacoes = [
    [".viagem-pais", "Japão"],
    [".viagem-data", "2027-04-10"],
    [".viagem-descricao", "Conhecer Tóquio"]
  ];

  for (const [seletor, esperado] of verificacoes) {

    const atual = texto(seletor, linha);

    if (atual !== esperado) {
      return {
        ok: false,
        motivo: "Os dados cadastrados não foram exibidos corretamente.",
        detalhe:
          `Em ${seletor}, era esperado "${esperado}", mas foi encontrado "${atual}".`
      };
    }
  }

  const img = linha.querySelector(".viagem-foto img");

  if (!img) {
    return {
      ok: false,
      motivo: "A imagem da viagem não foi criada.",
      detalhe: "Era esperada uma tag <img> dentro de .viagem-foto."
    };
  }

  const src = img.getAttribute("src");

  if (src !== "https://example.com/japao.jpg") {
    return {
      ok: false,
      motivo: "O link da foto não foi aplicado à imagem.",
      detalhe:
        `Era esperado o atributo src com o endereço informado pelo usuário.`
    };
  }

  return {
    ok: true,
    motivo: "País, foto, data e descrição foram exibidos corretamente."
  };
}


async function testarStatus() {

  const lista = linhas();

  if (lista.length === 0) {
    return {
      ok: false,
      motivo: "Não existe viagem cadastrada para verificar o status."
    };
  }

  if (texto(".viagem-status", lista[0]) !== "Quero ir") {
    return {
      ok: false,
      motivo: "O status da viagem não corresponde ao checkbox.",
      detalhe:
        `Com o checkbox desmarcado, era esperado o texto "Quero ir".`
    };
  }

  // Cria uma segunda viagem com checkbox marcado.
  preencherFormulario({
    pais: "Chile",
    foto: "https://example.com/chile.jpg",
    data: "2028-01-20",
    descricao: "Conhecer o Atacama",
    jaFui: true
  });

  clicar("#btnSalvar");
  await esperar();

  const atualizadas = linhas();

  if (atualizadas.length < 2) {
    return {
      ok: false,
      motivo: "Não foi possível cadastrar a viagem usada para testar o status.",
      detalhe: "O segundo cadastro não foi criado."
    };
  }

  const segunda = atualizadas[atualizadas.length - 1];

  if (texto(".viagem-status", segunda) !== "Já fui") {
    return {
      ok: false,
      motivo: "O checkbox marcado não gerou o status esperado.",
      detalhe:
        `Com o checkbox marcado, era esperado o texto "Já fui".`
    };
  }

  return {
    ok: true,
    motivo: "Os dois estados do checkbox foram tratados corretamente."
  };
}


async function testarLimpezaFormulario() {

  // Neste momento, o segundo cadastro já foi realizado.
  const valores = [
    obter("#pais").value,
    obter("#foto").value,
    obter("#dataViagem").value,
    obter("#descricao").value
  ];

  const checkbox = obter("#jaFui").checked;

  if (valores.some(valor => valor !== "") || checkbox !== false) {
    return {
      ok: false,
      motivo: "O formulário não foi limpo após o cadastro.",
      detalhe:
        "Os campos de texto/data devem voltar a vazio e o checkbox deve ficar desmarcado."
    };
  }

  return {
    ok: true,
    motivo: "O formulário foi limpo corretamente após o cadastro."
  };
}


async function testarEdicao() {

  const lista = linhas();

  if (lista.length === 0) {
    return {
      ok: false,
      motivo: "Não existe viagem cadastrada para testar a edição."
    };
  }

  const quantidadeAntes = lista.length;
  const primeira = lista[0];

  primeira.querySelector(".btn-editar").click();
  await esperar();

  // Verifica se o formulário foi preenchido.
  if (obter("#pais").value !== "Japão") {
    return {
      ok: false,
      motivo: "O botão Editar não carregou os dados no formulário.",
      detalhe:
        `Após clicar em Editar, o campo #pais deveria conter "Japão".`
    };
  }

  // Altera alguns campos.
  obter("#pais").value = "Japão - Atualizado";
  obter("#descricao").value = "Tóquio e Kyoto";
  obter("#jaFui").checked = true;

  clicar("#btnSalvar");
  await esperar();

  const listaDepois = linhas();

  if (listaDepois.length !== quantidadeAntes) {
    return {
      ok: false,
      motivo: "A edição criou uma nova viagem em vez de atualizar a existente.",
      detalhe:
        `Antes havia ${quantidadeAntes} item(ns) e depois da edição há ${listaDepois.length}.`
    };
  }

  const linhaAtualizada = listaDepois[0];

  if (texto(".viagem-pais", linhaAtualizada) !== "Japão - Atualizado") {
    return {
      ok: false,
      motivo: "O país não foi atualizado na edição.",
      detalhe:
        `Era esperado "Japão - Atualizado".`
    };
  }

  if (texto(".viagem-descricao", linhaAtualizada) !== "Tóquio e Kyoto") {
    return {
      ok: false,
      motivo: "A descrição não foi atualizada na edição.",
      detalhe:
        `Era esperado "Tóquio e Kyoto".`
    };
  }

  if (texto(".viagem-status", linhaAtualizada) !== "Já fui") {
    return {
      ok: false,
      motivo: "O status não foi atualizado na edição.",
      detalhe:
        `Após marcar o checkbox, era esperado "Já fui".`
    };
  }

  return {
    ok: true,
    motivo: "A edição carregou o formulário e atualizou o item sem duplicá-lo."
  };
}


async function testarExclusao() {

  const lista = linhas();

  if (lista.length === 0) {
    return {
      ok: false,
      motivo: "Não existe viagem para testar a exclusão."
    };
  }

  const quantidadeAntes = lista.length;

  lista[0].querySelector(".btn-excluir").click();
  await esperar();

  const quantidadeDepois = linhas().length;

  if (quantidadeDepois !== quantidadeAntes - 1) {
    return {
      ok: false,
      motivo: "O botão Excluir não removeu exatamente uma viagem.",
      detalhe:
        `Antes havia ${quantidadeAntes}; depois deveria haver ${quantidadeAntes - 1}, mas há ${quantidadeDepois}.`
    };
  }

  return {
    ok: true,
    motivo: "A viagem foi removida corretamente da página."
  };
}


async function testarValidacao() {

  // Primeiro esvazia o que restou da lista para facilitar a contagem.
  for (const linha of linhas()) {
    linha.querySelector(".btn-excluir")?.click();
  }

  await esperar();

  const antes = linhas().length;

  preencherFormulario({
    pais: "",
    foto: "",
    data: "",
    descricao: "",
    jaFui: false
  });

  clicar("#btnSalvar");
  await esperar();

  const depois = linhas().length;

  if (depois !== antes) {
    return {
      ok: false,
      motivo: "Foi permitido cadastrar uma viagem com campos vazios.",
      detalhe:
        "O cadastro deve ser interrompido quando país, foto, data ou descrição estiverem vazios."
    };
  }

  const erro = obter("#mensagemErro");

  if (erro.classList.contains("d-none")) {
    return {
      ok: false,
      motivo: "O cadastro foi bloqueado, mas a mensagem de erro não foi exibida.",
      detalhe:
        "Remova a classe d-none de #mensagemErro quando houver campos obrigatórios vazios."
    };
  }

  return {
    ok: true,
    motivo: "Campos obrigatórios vazios são bloqueados e a mensagem de erro é exibida."
  };
}


async function testarContador() {

  // Garante que começamos com a lista vazia.
  for (const linha of linhas()) {
    linha.querySelector(".btn-excluir")?.click();
  }

  await esperar();

  // Limpa eventual mensagem de erro anterior preenchendo um cadastro válido.
  preencherFormulario({
    pais: "Argentina",
    foto: "https://example.com/argentina.jpg",
    data: "2029-03-15",
    descricao: "Conhecer Buenos Aires",
    jaFui: false
  });

  clicar("#btnSalvar");
  await esperar();

  const contador = texto("#contadorViagens");

  if (!contador.includes("1")) {
    return {
      ok: false,
      motivo: "O contador não foi atualizado após o cadastro.",
      detalhe:
        `Com uma viagem cadastrada, #contadorViagens deveria indicar a quantidade 1.`
    };
  }

  const vazia = obter("#listaVazia");

  if (!vazia.classList.contains("d-none")) {
    return {
      ok: false,
      motivo: "A mensagem de lista vazia continua aparecendo com uma viagem cadastrada.",
      detalhe:
        "Quando houver itens, #listaVazia deve receber a classe d-none."
    };
  }

  linhas()[0].querySelector(".btn-excluir").click();
  await esperar();

  if (!texto("#contadorViagens").includes("0")) {
    return {
      ok: false,
      motivo: "O contador não voltou para zero após excluir o último item."
    };
  }

  if (obter("#listaVazia").classList.contains("d-none")) {
    return {
      ok: false,
      motivo: "A mensagem de lista vazia não reapareceu após excluir o último item."
    };
  }

  return {
    ok: true,
    motivo: "Contador e mensagem de lista vazia foram atualizados corretamente."
  };
}
