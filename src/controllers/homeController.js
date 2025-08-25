const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
    const contatos = await Contato.buscaContatosPorUsuario(req.session.user._id);
    const totalContatos = contatos.length;
    res.render('index', { contatos, totalContatos });
};