const Login = require('../models/loginModel');

exports.index = (req, res) => {
    if(req.session.user) return res.render('logado');
    return res.render('login');
};

exports.register = async function(req, res) {
    try {
        const login = new Login(req.body);
        await login.register();

        if(login.errors.length > 0) {
            req.flash('errors', login.errors);

            // Redirecionando de volta para a página de login
            req.session.save(function() { // Salva a sessão e depois redireciona
                return res.redirect('/login');
            });
            
            return;
        }

        req.flash('success', 'Usuário cadastrado com sucesso!');
        req.session.save(function() {
            return res.redirect('/login');
        });  
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
};

exports.login = async function(req, res) {
    try {
        const login = new Login(req.body);
        await login.login();

        if(login.errors.length > 0) {
            req.flash('errors', login.errors);

            // Redirecionando de volta para a página de login
            req.session.save(function() { // Salva a sessão e depois redireciona
                return res.redirect('/login');
            });
            
            return;
        }

        req.flash('success', 'Você entrou no sistema.');
        req.session.user = login.user;
        req.session.save(function() {
            return res.redirect('/login');
        });  
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
};

exports.logout = function(req, res) {
    req.session.destroy();
    res.redirect('/');
};