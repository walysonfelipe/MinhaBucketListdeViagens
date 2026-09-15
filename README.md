# Minha Bucket List de Viagens

<p align="center">
  <img src="walyson/mblv.png" alt="Logo MBLV - Minha Bucket List de Viagens" width="260">
</p>

## Sobre o projeto

Este projeto foi desenvolvido como uma prova prática da disciplina de JavaScript da faculdade.

A proposta do professor foi transformar uma estrutura HTML já pronta em uma aplicação funcional usando JavaScript, criando uma lista de viagens que o usuário deseja conhecer ou já visitou.

## O que foi solicitado pelo professor

O enunciado da prova solicitou:

- cadastrar viagens em uma tabela;
- exibir foto, país/destino, data e descrição;
- controlar o status entre `Já fui` e `Quero ir`;
- limpar o formulário após o cadastro;
- editar uma viagem sem duplicá-la;
- excluir uma viagem específica;
- validar os campos obrigatórios;
- atualizar o contador de viagens;
- exibir uma mensagem quando a lista estiver vazia.

Também foi solicitado que as classes e IDs fornecidos no HTML fossem preservados para que o corretor automático pudesse analisar o DOM produzido pelo JavaScript.

## O que foi desenvolvido

A aplicação foi implementada com JavaScript, mantendo os seletores exigidos pelo avaliador:

- cadastro dinâmico de viagens dentro de `#listaViagens`;
- criação das linhas com a classe `.viagem-item`;
- exibição da imagem dentro de `.viagem-foto`;
- edição e exclusão por viagem;
- validação de país, foto, data e descrição;
- limpeza automática do formulário;
- atualização do contador e do estado da lista;
- manutenção dos botões e classes exigidos pelo corretor.

## Recursos adicionados além do solicitado

Além dos requisitos da prova, foram adicionados recursos de experiência do usuário:

- identidade visual própria da MBLV;
- logo da aplicação no cabeçalho;
- layout inspirado no Liquid Glass, com transparência, blur e sombras suaves;
- fonte nativa adaptável para macOS, Windows e outros sistemas;
- ícones do Remix Icon nos campos, títulos e ações;
- alertas no estilo toast, criados apenas com JavaScript e CSS, para cadastro, edição e exclusão;
- opção oculta para escolher uma imagem do computador;
- suporte a imagens por URL ou arquivo local temporário;
- destaque visual para a viagem que está sendo editada;
- footer com autoria e link para [walysonassis.online](https://walysonassis.online).

## Tecnologias utilizadas

- HTML5;
- CSS3;
- JavaScript puro;
- Bootstrap para a estrutura visual inicial;
- Remix Icon via CDN;
- `URL.createObjectURL()` para visualizar imagens locais temporariamente.

## Como executar

Por causa das restrições de segurança do navegador, recomenda-se executar o projeto por um servidor HTTP local.

No Visual Studio Code:

1. Instale a extensão Live Server;
2. Abra a pasta do projeto;
3. Clique com o botão direito em `corretor/avaliador.html`;
4. Selecione **Open with Live Server**;
5. Clique em **Executar correção**.

## Estrutura principal

```text
MinhaBucketListdeViagens/
├── corretor/
│   ├── avaliador.html
│   └── avaliador.js
├── walyson/
│   ├── index.html
│   ├── index.js
│   ├── mblv.png
│   └── style.css
├── enunciado.pdf
└── README.md
```

## Autoria

Desenvolvido por [Walyson Assis](https://walysonassis.online) como atividade acadêmica da disciplina de JavaScript.
