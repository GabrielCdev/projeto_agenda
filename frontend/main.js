import 'core-js/stable';
import 'regenerator-runtime/runtime';
// import './assets/css/style.css';
import Login from './modules/login';
import Cadastro from './modules/cadastro';

const login = new Login('.form-login');
const cadastro = new Cadastro('.form-cadastro');

login.init();
cadastro.init();