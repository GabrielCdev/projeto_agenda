// npm install
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        app.emit('Pronto!');
    })
    .catch(e => console.log(e));

const session = require('express-session'); // Identificar o navegador de um cliente (cookie)
const MongoStore = require('connect-mongo')(session); // Sessões serão salvas dentro da base de dados (Padrão = salvas na memória, mas, em produção, salvar em memória resulta em falta de armazenamento)
const flash = require('connect-flash'); // Mensagens auto-destrutíveis na base de dados
const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf'); // CSRF Tokens para os formulários, para que nenhum app externo consiga fazer POST na nossa aplicação
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
    secret: 'fnqrxighrowlenfhoreçwfw',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());
// Middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on('Pronto!', () => {
    app.listen(3000, () => {
        console.log('Link: http://localhost:3000');
        console.log('Server running on port 3000...');
    });    
});