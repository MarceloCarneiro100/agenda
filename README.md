
# 📒 Projeto Agenda - Node.js + Express + MongoDB

Aplicação web de agenda de contatos, desenvolvida com Node.js, Express, MongoDB e EJS. Permite que usuários autenticados possam cadastrar, editar, visualizar, importar e exportar contatos.

---

## 🚀 Funcionalidades

- 🔐 Login e logout com sessão  
- ✅ Cadastro de usuários  
- 📇 Cadastro de contatos com nome, sobrenome, e-mail e telefone  
- 🔀 Ordenação de contatos (A → Z / Z → A)  
- 🔍 Pesquisa por contatos com paginação  
- ✏️ Edição de contatos existentes  
- 🗑️ Exclusão de contatos individuais ou em massa  
- 📤 Exportação de contatos em PDF ou CSV  
- 📥 Importação de contatos via arquivo CSV  
- ⚠️ Validação de dados (nome obrigatório, e-mail válido, pelo menos um meio de contato)  
- 🔒 Proteção de rotas com middleware de autenticação  
- 💬 Mensagens de erro e sucesso com `connect-flash`  
- 🛡️ CSRF protection  

---


## 🧱 Estrutura do Projeto

```bash
AGENDA/
├── frontend/                          # Código do cliente (frontend)
│   ├── assets/                        # Recursos estáticos do frontend
│   │   ├── css/                       # Arquivos de estilo
│   │   ├── img/                       # Imagens utilizadas na interface
│   │   └── js/                        # Scripts JavaScript empacotados pelo Webpack
│   ├── modules/                       # Módulos JS com validações de formulário
│   │   ├── CadastroContato.js         # Validação de formulário de contato
│   │   └── Login.js                   # Validação de formulário de login/cadastro
│   └── main.js                        # Script principal que inicializa os módulos
├── public/                            # Arquivos públicos acessíveis pelo navegador
│   └── assets/                        # Saída do Webpack
│       ├── bundle.js                  # Arquivo JS empacotado
│       └── bundle.js.map              # Mapa de origem para debug
├── src/                               # Código do servidor (backend)
│   ├── assets/                        # Arquivos internos como fontes e imagens
│   ├── controllers/                   # Lógica das rotas e controle de fluxo
│   ├── middlewares/                   # Middlewares personalizados
│   ├── models/                        # Modelos de dados (ex: Mongoose)
│   ├── tests/                         # Testes automatizados
│   │   ├── integration/               # Testes de integração dos controllers
│   │   │   ├── loginController.test.js    # Testes do controller de login
│   │   │   ├── contatoController.test.js  # Testes do controller de contato
│   │   │   └── homeController.test.js     # Testes do controller da página inicial
│   │   └── models/                    # Testes unitários dos models
│   │       ├── loginModel.test.js     # Testes do modelo de login
│   │       └── contatoModel.test.js   # Testes do modelo de contato
│   └── views/                         # Templates de visualização (EJS)
├── uploads/                           # Armazena temporariamente arquivos enviados via formulário (ex: CSV)
├── .env                               # Variáveis de ambiente
├── .gitignore                         # Arquivos e pastas ignorados pelo Git
├── app.js                             # Arquivo que configura e exporta a instância do Express
├── package-lock.json                  # Controle de versões das dependências
├── package.json                       # Dependências e scripts do projeto
├── routes.js                          # Definição das rotas da aplicação
├── server.js                          # Inicialização do servidor e conexão com MongoDB
└── webpack.config.js                  # Configuração do Webpack

```


---

## 📦 Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/MarceloCarneiro100/agenda.git
cd agenda

# 2. Instale as dependências
npm install
```

```env
# 3. Configure o MongoDB Atlas
CONNECTIONSTRING=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<nome-do-banco>
```

Crie um arquivo `.env` na raiz do projeto e substitua os campos:

- `<usuario>`: seu nome de usuário  
- `<senha>`: sua senha  
- `<cluster>`: nome do cluster (ex: `cluster0`)  
- `<nome-do-banco>`: nome do banco (ex: `agenda`)  

```bash
# 4. Execute o projeto
npm start
```

Acesse no navegador:  
[http://localhost:3000/login/index](http://localhost:3000/login/index)

---

## 🧪 Testando Manualmente

```text
- Acesse /login/index e crie uma conta
- Faça login e cadastre contatos
- Edite e exclua contatos existentes
- Teste validações e mensagens de erro
- Exporte contatos em PDF ou CSV
- Importe contatos via arquivo CSV
```

---

## 🧪 Testes Automatizados

### ✅ Testes Unitários

- LoginModel: validação, registro, autenticação, limpeza de dados  
- ContatoModel: validação, limpeza, registro, edição, busca, exclusão, paginação, contagem por termo e por usuário  

### ✅ Testes de Integração

- LoginController:
  - Registro de usuário
  - Login com sessão
  - Logout

- ContatoController:
  - Registro de contato
  - Edição de contato
  - Exclusão individual e em massa
  - Buscar contatos por termo
  - Exportação e importação em CSV 
  - Exportação em PDF

- HomeController:
  - Renderização da página inicial com paginação

### ▶️ Como Executar os Testes

```bash
# Executar todos os testes
npm test

# Executar apenas os testes de integração
npx jest src/tests/integration

# Executar um teste específico
npx jest src/tests/integration/loginController.test.js
```

---

## 🧰 Tecnologias Utilizadas

### 💻 Plataforma e Backend

| Tecnologia | Descrição                                      |
|------------|------------------------------------------------|
| Node.js    | Ambiente de execução JavaScript no servidor   |
| Express    | Framework web para Node.js                    |
| MongoDB    | Banco de dados NoSQL                          |
| Mongoose   | ODM para MongoDB                              |
| EJS        | Template engine para renderização de views    |

---

### 🔐 Gerenciamento e Segurança

| Tecnologia        | Descrição                                      |
|-------------------|------------------------------------------------|
| dotenv            | Variáveis de ambiente                         |
| express-session   | Gerenciamento de sessões                      |
| connect-mongo     | Armazenamento de sessões no MongoDB           |
| connect-flash     | Mensagens de erro e sucesso                   |
| csurf             | Proteção contra CSRF                          |
| express-validator | Validação de dados                            |

---

### 📤 Importação e Exportação

| Tecnologia | Descrição                          |
|------------|-------------------------------------|
| pdfmake    | Geração de arquivos PDF            |
| fast-csv   | Manipulação de arquivos CSV        |
| multer     | Upload de arquivos                 |

---

### 🧪 Testes

| Tecnologia | Descrição             |
|------------|------------------------|
| Jest       | Testes unitários       |
| Supertest  | Testes de integração   |


---

## 🌐 Outros idiomas

- 🇺🇸 [English Version](README.en.md)



## ✍️ Autor

Este projeto foi desenvolvido por Marcelo Carneiro Marques com base nas aulas do curso "Curso de Javascript e Typescript  do básico ao avançado JS/TS" disponível na Udemy, ministrado pelo instrutor Luiz Otávio Miranda.
Muitas partes foram aprimoradas com inclusão de novas funcionalidades para fins de aprendizado e melhoria da estrutura original.


