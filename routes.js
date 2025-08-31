const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');
const { loginRequired, csrfMiddleware, checkCsrfError } = require('./src/middlewares/middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // pasta temporária

route.get('/', loginRequired, homeController.index);

// Rotas de login
route.get('/login/index', csrfMiddleware, loginController.index);
route.post('/login/register', checkCsrfError, loginController.register);
route.post('/login/login', checkCsrfError, loginController.login);
route.get('/login/logout', loginController.logout);

// Rotas de contato
route.get('/contato/index', loginRequired, csrfMiddleware, contatoController.index);
route.post('/contato/register', loginRequired, checkCsrfError, contatoController.register);
route.get('/contato/index/:id', loginRequired, csrfMiddleware, contatoController.editIndex);
route.post('/contato/edit/:id', loginRequired, checkCsrfError, contatoController.edit);
route.get('/contato/delete/:id', loginRequired, contatoController.delete);
route.get('/contato/busca', loginRequired, contatoController.busca);
route.get('/contato/exportar', loginRequired, contatoController.exportar);

route.get('/contato/importar-csv', loginRequired, csrfMiddleware, contatoController.importarView);
route.post('/contato/importar-csv', loginRequired, upload.single('csvFile'), contatoController.importarCSV);

module.exports = route;