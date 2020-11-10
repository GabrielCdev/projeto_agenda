const mongoose = require('mongoose');
const validator = require('validator');

const contatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' }, // default: '' = se não for enviado salva como string vazia
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now }
});

const contatoModel = mongoose.model('contato', contatoSchema);

function Contato(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
}

Contato.prototype.register = async function() {
    this.valida();

    if(this.errors.length > 0) return;

    this.contato = await contatoModel.create(this.body);
};

Contato.prototype.valida = function() {
    this.cleanUp();

    if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido!');
    if(!this.body.nome) this.errors.push('Nome é obrigatório!');
    if(!this.body.email && !this.body.telefone) {
        this.errors.push('É necessário, pelo menos, um e-mail ou telefone!');
    }
};

Contato.prototype.cleanUp = function() {
    for(const key in this.body) {
        if(typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone
    };
};

Contato.prototype.edit = async function(id) {
    if(typeof id !== 'string') return;
    
    this.valida();

    if(this.errors.length > 0) return;

    this.contato = await contatoModel.findByIdAndUpdate(id, this.body, { new: true });
};

// Método estáticos
Contato.buscaPorId = async function(id) {
    if(typeof id !== 'string') return;
    
    const contato = await contatoModel.findById(id);

    return contato;
};

Contato.buscaContatos = async function(id) { 
    const contatos = await contatoModel.find()
        .sort({ criadoEm: -1 }); // 1 = Crescente, -1 = Decrescente

    return contatos;
};

Contato.delete = async function(id) { 
    if(typeof id !== 'string') return;

    const contato = await contatoModel.findOneAndDelete({_id: id}); // Manda um objeto com filtro, para apagar um específico

    return contato;
};

module.exports = Contato;