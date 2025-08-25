import 'core-js/stable';
import 'regenerator-runtime/runtime';

import './assets/css/style.css';

import Login from './modules/Login';
import CadastroContato from './modules/CadastroContato';

const cadastro = new Login('.form-entrada-cadastro')
const login = new Login('.form-entrada-login');
const cadastroContato = new CadastroContato('.form-cadastro');

cadastro.init();
login.init();
cadastroContato.init();
