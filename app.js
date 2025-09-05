require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const { middlewareGlobal, checkCsrfError, setContentSecurityPolicy } = require('./src/middlewares/middleware');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(setContentSecurityPolicy);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'frontend')));

const sessionOptions = session({
    secret: 'palavra-secreta',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());
app.use(middlewareGlobal);
app.use(routes);

if (process.env.NODE_ENV !== 'test') {
  app.use(checkCsrfError);
}

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

module.exports = app;