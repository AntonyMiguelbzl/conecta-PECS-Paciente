# Conecta PECS

Sistema de comunicação assistiva em formato de prancha PECS para pacientes, com interface web e suporte para Android via Capacitor. O projeto foi pensado para facilitar a construção de frases por meio de cartões visuais, com leitura de voz em português e integração com Firebase para autenticação e sincronização de dados do paciente.

## Visão geral

O Conecta PECS permite que o paciente:

- acesse uma tela de login simples;
- utilize uma prancha com categorias de comunicação;
- selecione cartões visuais para montar frases;
- escute a frase em voz sintetizada;
- tenha acesso a cartões personalizados carregados do banco;
- use o modo de demonstração caso queira testar rapidamente sem login.

A aplicação também possui:

- backend leve com Express;
- servidor de desenvolvimento Vite;
- integração com Firebase Firestore;
- suporte para Android com Capacitor.

## Tecnologias utilizadas

### Frontend
- React 19
- Vite 6
- TypeScript
- Tailwind CSS
- Motion / Framer Motion
- Lucide React

### Backend
- Express
- CORS
- JWT
- Drizzle ORM
- PostgreSQL

### Integração e mobile
- Firebase
- Capacitor
- Capacitor Community Text-to-Speech

### Desenvolvimento
- TypeScript
- tsx
- esbuild
- drizzle-kit

## Estrutura principal do projeto

```text
.
├── src/
│   ├── App.tsx
│   ├── firebaseConfig.ts
│   ├── constants.ts
│   ├── components/
│   └── utils/
├── server.ts
├── capacitor.config.ts
├── package.json
└── README.md
```

## Requisitos mínimos

Antes de instalar o projeto, verifique se sua máquina possui:

- Git
- Node.js 20+ recomendado
- npm 10+
- Android Studio (somente se você quiser gerar e executar o app no Android)
- Java JDK 17+ (para build Android)
- Android SDK e emulador ou dispositivo físico

## Clone do repositório

No terminal, execute:

```bash
git clone <url-do-repositorio>
cd conecta-pecs
```

## Instalação das dependências

Dentro da pasta do projeto, execute:

```bash
npm install
```

Esse comando instala todas as bibliotecas listadas em `package.json`, incluindo:

- React e React DOM
- Vite
- Express
- Firebase
- Capacitor
- Text-to-Speech
- TypeScript
- Tailwind CSS
- PostgreSQL e Drizzle

Se houver algum erro de instalação, pode ser por causa de versão do Node ou falta de dependências do sistema. Neste caso:

1. confirme a versão do Node:

```bash
node -v
npm -v
```

2. se necessário, atualize o Node.js para uma versão compatível.

## Configuração atual do Firebase

No estado atual do projeto, a configuração do Firebase não está sendo lida de um arquivo `.env`. Ela está definida diretamente nos arquivos:

- [src/firebaseConfig.ts](src/firebaseConfig.ts)
- [src/App.tsx](src/App.tsx)

Isso significa que, para usar outro projeto Firebase, a pessoa precisa abrir esses arquivos e trocar as chaves e URLs de configuração manualmente.

O servidor também usa um valor padrão para `JWT_SECRET` em [server.ts](server.ts), então, se você quiser adaptar a autenticação, pode ajustar esse valor diretamente ali.

## Como rodar localmente

### 1. Iniciar o ambiente de desenvolvimento

```bash
npm run dev
```

Esse comando inicia o servidor Express/Vite. A aplicação fica disponível em:

```text
http://localhost:3000
```

### 2. Abrir a aplicação

Abra o navegador e acesse:

```text
http://localhost:3000
```

## Fluxo de uso da aplicação

### Login do paciente

Na tela de login:

- informe o e-mail do paciente;
- informe a senha;
- clique em entrar.

Caso o cadastro não exista ou a senha esteja incorreta, a tela exibirá mensagem de erro.

### Modo de demonstração

Há um botão para acessar o sistema em modo de demonstração, sem precisar logar com dados reais.

### Prancha PECS

Após entrar, o paciente visualiza:

- uma barra de frase no topo;
- categorias na lateral;
- cartões de comunicação organizados por contexto;
- botão para falar a frase construída;
- botão de configuração, protegido por uma verificação simples.

### Voz

A aplicação tenta ler os textos em português usando:

- sintetizador nativo no Android/iOS;
- `speechSynthesis` no navegador web.

## Build para produção

Para gerar a versão de produção:

```bash
npm run build
```

Esse comando gera a pasta `dist` com a build compilada do frontend e do servidor.

Para iniciar em produção:

```bash
npm run start
```

## Executar em Android com Capacitor

### 1. Instalar o Capacitor

As dependências já estão no `package.json`, mas se for necessário instalar novamente:

```bash
npm install
```

### 2. Adicionar a plataforma Android

```bash
npx cap add android
```

### 3. Fazer o build da aplicação web

```bash
npm run build
```

### 4. Sincronizar com o Android

```bash
npx cap sync android
```

### 5. Abrir o projeto no Android Studio

```bash
npx cap open android
```

A partir daí, você pode:

- rodar no emulador;
- instalar em um dispositivo Android via USB;
- ajustar o projeto em Gradle conforme necessário.

## Dependências principais do projeto

Se você for reinstalar tudo manualmente, as bibliotecas principais são:

```bash
npm install react react-dom vite @vitejs/plugin-react @tailwindcss/vite lucide-react motion firebase @capacitor/core @capacitor/android @capacitor-community/text-to-speech express cors dotenv jsonwebtoken pg drizzle-orm
```

E as ferramentas de desenvolvimento:

```bash
npm install -D typescript @types/node @types/react @types/react-dom @types/express @types/cors @types/jsonwebtoken @types/pg drizzle-kit esbuild tsx @capacitor/cli tailwindcss autoprefixer
```

## Comandos úteis

```bash
npm run dev
npm run build
npm run start
npm run preview
npm run lint
```

## Observações importantes sobre o Firebase

O projeto faz uso de Firestore para:

- buscar os pacientes;
- verificar e-mails e senhas;
- carregar cartões personalizados por paciente;
- sincronizar a frase atual do paciente.

No projeto atual, a configuração do Firebase está apontando para os valores já definidos nos arquivos [src/firebaseConfig.ts](src/firebaseConfig.ts) e [src/App.tsx](src/App.tsx). Portanto, para usar outro projeto Firebase, basta trocar essas chaves e configurações nesses arquivos.

## Possíveis problemas comuns

### Erro ao instalar pacotes

- verifique a versão do Node;
- apague a pasta `node_modules` e o arquivo `package-lock.json` e tente novamente;
- execute `npm cache verify` se necessário.

### Aplicação não abre no navegador

- confirme se o comando `npm run dev` está rodando;
- confira se a porta `3000` está livre;
- verifique se o servidor não foi bloqueado por firewall.

### Erro no Android

- verifique se o Android Studio está instalado corretamente;
- confirme se o SDK do Android está configurado;
- rode `npx cap sync android` depois de cada build.

### Voz não funciona

- em navegador, use um navegador moderno com suporte a `speechSynthesis`;
- em Android, teste em aparelho físico ou em um emulador com suporte adequado.

## Melhor prática de desenvolvimento

Para um fluxo de trabalho mais confortável:

1. rode `npm run dev`;
2. faça alterações no frontend e no backend;
3. rode `npm run build` antes de empacotar para Android;
4. sincronize o Capacitor com `npx cap sync android`.

## Resumo rápido de instalação

Se você acabou de clonar o projeto, os passos resumidos são:

```bash
git clone <url-do-repositorio>
cd conecta-pecs
npm install
npm run dev
```

Depois, para Android:

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

## Licença

Este projeto é um repositório de desenvolvimento interno e deve ser ajustado conforme a política da organização responsável.
