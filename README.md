# TCP Chat App

Aplicação de chat em tempo real construída com Node.js e o módulo nativo
`net`. O projeto demonstra uma comunicação cliente-servidor usando sockets TCP:
cada cliente se conecta ao servidor, envia mensagens e recebe o broadcast das
mensagens dos demais participantes.

## Visão geral

O projeto é composto por três arquivos:

- [`server.js`](./server.js) — inicia o servidor TCP, controla os clientes
  conectados e distribui as mensagens.
- [`client.js`](./client.js) — conecta ao servidor e fornece a interface de
  terminal para envio e recebimento de mensagens.
- [`utils.js`](./utils.js) — concentra a leitura assíncrona do terminal e o
  reposicionamento do cursor para manter o prompt legível.

### Fluxo de uma mensagem

1. O cliente abre uma conexão TCP com o host e a porta configurados.
2. O servidor registra o socket e atribui um identificador numérico ao cliente.
3. O texto digitado é enviado ao servidor.
4. O servidor transmite a mensagem para todos os clientes conectados,
   identificando o remetente no formato `[id]: mensagem`.
5. Ao entrar ou sair um cliente, os demais recebem uma notificação do sistema.

## Requisitos

- [Node.js](https://nodejs.org/) 14 ou superior
- Dois terminais ou duas máquinas na mesma rede/acessíveis pela rede
- A porta TCP `5500` liberada no firewall e, quando necessário, no security
  group da infraestrutura

O projeto não possui dependências externas nem exige `npm install`.

## Configuração

Os endereços de rede estão definidos diretamente no código:

- [`server.js`](./server.js) escuta em `172.31.6.71:5500`.
- [`client.js`](./client.js) conecta em `52.67.83.104:5500`.

Esses endereços parecem representar uma configuração específica de ambiente
(por exemplo, um servidor em nuvem). Antes de executar a aplicação, ajuste as
constantes `HOST` para o ambiente desejado:

```js
// server.js
const PORT = 5500;
const HOST = "0.0.0.0"; // ou o IP da interface de rede do servidor
```

```js
// client.js
const PORT = 5500;
const HOST = "ENDERECO_DO_SERVIDOR";
```

Use `0.0.0.0` no servidor somente quando for necessário aceitar conexões em
todas as interfaces. Em produção, prefira restringir o bind e as regras de
firewall às interfaces e origens necessárias.

## Como executar

### 1. Inicie o servidor

No terminal da máquina que receberá as conexões:

```bash
node server.js
```

Quando iniciado corretamente, o terminal exibirá uma mensagem semelhante a:

```text
Servidor rodando em 172.31.6.71:5500
```

### 2. Inicie um ou mais clientes

Em outro terminal, após ajustar o `HOST` do cliente:

```bash
node client.js
```

Digite uma mensagem e pressione `Enter`. Para testar o broadcast, execute
`node client.js` em dois ou mais terminais. O servidor exibirá as conexões,
mensagens e desconexões.

## Exemplo de interação

```text
Connected to the server.
Enter a menssage: Olá!
[1]: Olá!
```

Os clientes conectados também recebem eventos do sistema:

```text
[Sistema] Usuário 2 entrou no chat.
[Sistema] Usuário 2 saiu do chat.
```

## Protocolo atual

O protocolo é textual e roda sobre TCP:

- **Porta:** `5500`
- **Codificação:** UTF-8
- **Entrada:** texto digitado pelo usuário
- **Broadcast:** `[id-do-remetente]: mensagem`
- **Eventos:** mensagens prefixadas com `[Sistema]`

Não há comandos especiais, cadastro de usuários ou estrutura JSON. O
identificador é atribuído pelo servidor durante a conexão e é mantido apenas
enquanto o cliente está conectado.

## Decisões técnicas demonstradas

- Uso do módulo nativo `node:net`, sem framework ou dependência de terceiros.
- Modelo orientado a eventos por meio dos eventos `data`, `error` e `close`.
- Gerenciamento de conexões em memória.
- Broadcast para múltiplos sockets conectados.
- Tratamento básico de desconexões normais e abruptas (`ECONNRESET`).
- Interface interativa de terminal com `node:readline/promises`.

## Objetivo do projeto

O projeto serve como uma implementação compacta de comunicação em tempo real
com TCP e Node.js. Ele evidencia conhecimentos de redes, sockets, programação
assíncrona orientada a eventos e organização de um fluxo básico de broadcast
entre clientes.
