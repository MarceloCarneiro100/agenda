const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    telefoneLimpo: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Login', required: true }
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

// Usando constructor function
function Contato(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
}

Contato.prototype.register = async function (userId) {
    this.valida();
    if (this.errors.length > 0) return;

    this.body.userId = userId;
    this.contato = await ContatoModel.create(this.body);
};


Contato.prototype.valida = function () {
    this.cleanUp();
    // Validação
    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido.');
    if (!this.body.nome) this.errors.push('Nome é um campo obrigatório.');
    if (!this.body.email && !this.body.telefone) {
        this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone.');
    }

    if (this.body.telefone && !/^\(\d{2}\)\d{4,5}-\d{4}$/.test(this.body.telefone)) {
        this.errors.push('Telefone inválido. Use o formato (xx)xxxxx-xxxx ou (xx)xxxx-xxxx.');
    }

};

Contato.prototype.cleanUp = function () {
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    const telefoneLimpo = this.body.telefone.replace(/\D/g, '');

    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
        telefoneLimpo: telefoneLimpo
    };
};

Contato.prototype.edit = async function (id) {
    if (typeof id !== 'string') return;
    this.valida();
    if (this.errors.length > 0) return;
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
};

// Métodos estáticos
Contato.buscaPorId = async function (id) {
    if (typeof id !== 'string') return;
    const contato = await ContatoModel.findById(id);
    return contato;
};

Contato.buscaContatosPorUsuario = async function (userId) {
    const contatos = await ContatoModel.find({ userId }).sort({ criadoEm: -1 });
    return contatos;
};

Contato.delete = async function (id) {
    if (typeof id !== 'string') return;
    const contato = await ContatoModel.findOneAndDelete({ _id: id });
    return contato;
};

Contato.buscaPorTermo = async function (termo, userId) {
    if (typeof termo !== 'string') return [];

    const regex = new RegExp(termo, 'i');
    const termoNumerico = termo.replace(/\D/g, '');

    return await ContatoModel.find({
        userId,
        $or: [
            { nome: regex },
            { sobrenome: regex },
            { email: regex },
            { telefone: regex },
            { telefoneLimpo: termoNumerico }
        ]
    });
};


module.exports = Contato;