# Projeto de Portfólio: API RESTful Escalável & Frontend Moderno

Este é um projeto completo de gerenciamento de projetos e tarefas (Task Manager ou Kanban Simplificado). Ele foi construído utilizando as melhores e mais modernas práticas do mercado para servir como uma forte peça de portfólio.

## Stack de Tecnologias

### Backend
- **Node.js + Express**: Servidor REST web rápido e minimalista.
- **TypeScript**: Para tipagem forte e evitar erros em tempo de execução.
- **Prisma ORM**: Gerenciamento do banco de dados relacional.
- **PostgreSQL**: Banco de dados relacional poderoso (hospedado no Aiven).
- **Zod**: Validação de dados de entrada na API (schemas).
- **JWT + bcryptjs**: Autenticação segura por tokens e hash de senhas.

### Frontend
- **React + Vite**: Framework performático e bundler super rápido.
- **TypeScript**: Para integrar perfeitamente com a tipagem da API.
- **Lucide React**: Ícones SVG minimalistas e modernos.
- **CSS Puro (Vanilla)**: Design system customizado utilizando *Glassmorphism*, paletas contrastantes, gradientes suaves e micro-interações sem dependência de bibliotecas pesadas.
- **Axios**: Gerenciamento de requisições HTTP com interceptadores de token.
- **React Router v6**: Navegação Single Page Application (SPA).

---

## 🚀 Como Executar o Projeto Localmente

Siga o passo a passo abaixo para rodar tanto a API quanto a interface visual na sua máquina.

### 1. Requisitos Prévios
- Node.js (preferencialmente versão 18 ou superior).
- Uma conta no [Aiven](https://aiven.io/) com um banco de dados PostgreSQL criado (ou instale o PostgreSQL localmente).

### 2. Configurando o Backend (API)
Navegue até a pasta `api`:
```bash
cd api
```

Instale as dependências:
```bash
npm install
```

Configure as variáveis de ambiente:
Você verá um arquivo chamado `.env` na raiz da pasta `api`. Atualize a linha `DATABASE_URL` colocando a **Service URI** que você obteve no painel do Aiven.
Exemplo:
```env
DATABASE_URL="postgres://avnadmin:suasenha@seu-host.aivencloud.com:25345/defaultdb?sslmode=require"
JWT_SECRET="sua-chave-secreta-para-tokens-aqui"
PORT=3001
```

Sincronize o Banco de Dados (criação das tabelas):
```bash
npx prisma db push
```

Inicie o Servidor de Desenvolvimento:
```bash
npm run dev
# Você pode precisar rodar via npx ts-node src/server.ts 
# ou configurar os scripts no package.json.
```
*O servidor estará escutando na porta 3001.*

### 3. Configurando o Frontend (Web)
Abra um **novo terminal**, volte para a raiz do repositório e acesse a pasta `web`:
```bash
cd web
```

Instale as dependências:
```bash
npm install
```

Inicie o Frontend:
```bash
npm run dev
```

Abra o seu navegador e acesse: `http://localhost:5173` (ou a porta mostrada no terminal).

---

## 📸 Funcionalidades
1. **Autenticação**: Crie uma conta ou entre. Seus dados e projetos são privados.
2. **Dashboard**: Crie projetos com nome e descrição. Acompanhe a quantidade e status geral das suas tarefas.
3. **Gestão de Tarefas (Kanban-Like)**: Acesse um projeto e adicione Tarefas. Altere o status delas entre `A Fazer`, `Em Progresso`, e `Concluído`.

Aproveite o projeto! Construído como portfólio para demonstrar habilidades Fullstack sólidas e escaláveis.
