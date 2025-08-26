const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
    const ordem = req.query.ordem || 'asc';
    const contatos = await Contato.buscaContatosPorUsuario(req.session.user._id);

    contatos.sort((a, b) => {
        return ordem === 'asc'
            ? a.nome.localeCompare(b.nome)
            : b.nome.localeCompare(a.nome)
    });

    const totalContatos = contatos.length;

    const termo = '';

    res.render('index', {
        contatos,
        totalContatos,
        ordem,
        termo
    });
};