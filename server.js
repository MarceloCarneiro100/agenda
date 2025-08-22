require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTIONSTRING)
  .then(() => {
    app.emit('pronto');
  })
  .catch(e => console.log(e));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');

const helmet = require('helmet');
const csrf = require('csurf');

const { middlewareGlobal, checkCsrfError, csrfMiddleware, setContentSecurityPolicy } = require('./src/middlewares/middleware');
const porta = 3000;

app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(setContentSecurityPolicy);
app.use(express.urlencoded({ extended: true }));

// Definição do diretório para arquivos estáticos
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
  secret: 'palavra-secreta',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    // 7 dias em milissegundos
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});

app.use(sessionOptions);
app.use(flash());
app.use(csrf());

// Nossos próprios middlewares
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(middlewareGlobal);

// Permite que o Express use as rotas
app.use(routes);

// Configuração da view (diretório e engine)
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.on('pronto', () => {
  app.listen(porta, () => {
    console.log('Acessar http://localhost:3000');
    console.log(`Aplicação rodando na porta ${porta}`);
  });
});