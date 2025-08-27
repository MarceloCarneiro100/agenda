const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
    const paginaAtual = Number(req.query.pagina) || 1;
    const limitePorPagina = Number(req.query.limite) || 5;
    const ordem = req.query.ordem || 'asc';
    const userId = req.session.user._id;

    const skip = (paginaAtual - 1) * limitePorPagina;

    const contatos = await Contato.buscaPaginadaPorUsuario(userId, ordem, skip, limitePorPagina);
    const totalContatos = await Contato.contatosPorUsuario(userId);
    const totalPaginas = Math.ceil(totalContatos / limitePorPagina);

    res.render('index', {
        contatos,
        paginaAtual,
        totalPaginas,
        totalContatos,
        ordem,
        limite: limitePorPagina,
        termo: ''
    });
};