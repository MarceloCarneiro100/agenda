const Contato = require('../models/ContatoModel');
const PdfPrinter = require('pdfmake');
const path = require('path');
const fs = require('fs');

exports.index = (req, res) => {
    res.render('contato', {
        contato: {}
    });
};

exports.register = async (req, res) => {
    try {
        const contato = new Contato(req.body);
        await contato.register(req.session.user._id);

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect('/contato/index'));
            return;
        }

        req.flash('success', 'Contato registrado com sucesso!');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
        return;
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};

exports.editIndex = async function (req, res) {
    try {
        if (!req.params.id) return res.render('404');

        const contato = await Contato.buscaPorId(req.params.id);
        if (!contato || contato.userId.toString() !== req.session.user._id) return res.render('404');

        res.render('contato', { contato });
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};

exports.edit = async function (req, res) {
    try {
        if (!req.params.id) return res.render('404');

        const contatoOriginal = await Contato.buscaPorId(req.params.id);

        if (!contatoOriginal || contatoOriginal.userId.toString() !== req.session.user._id) {
            return res.render('404');
        }

        const contato = new Contato(req.body);
        await contato.edit(req.params.id);

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect(`/contato/index/${req.params.id}`));
            return;
        }

        req.flash('success', 'Contato editado com sucesso!');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
        return;
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};

exports.delete = async function (req, res) {
    try {
        if (!req.params.id) return res.render('404');

        const contatoOriginal = await Contato.buscaPorId(req.params.id);

        if (!contatoOriginal || contatoOriginal.userId.toString() !== req.session.user._id) {
            return res.render('404');
        }

        const contato = await Contato.delete(req.params.id);
        if (!contato) return res.render('404');

        req.flash('success', 'Contato apagado com sucesso');
        req.session.save(() => res.redirect('/'));
        return;
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};

exports.busca = async (req, res) => {
    const termo = req.query.q || '';
    const userId = req.session.user._id;
    const ordem = req.query.ordem || 'asc';
    const limite = parseInt(req.query.limite) || 5;
    const pagina = parseInt(req.query.pagina) || 1;
    const skip = (pagina - 1) * limite;

    // Busca os contatos paginados
    const contatos = await Contato.buscaPorTermo(termo, userId, ordem, skip, limite);

    // Conta o total de contatos que batem com o termo (sem paginação)
    const totalContatos = await Contato.contarPorTermo(termo, userId);

    // Ordena os contatos da página atual (se necessário)
    contatos.sort((a, b) => {
        const nomeA = a.nome || '';
        const nomeB = b.nome || '';
        return ordem === 'asc'
            ? nomeA.localeCompare(nomeB)
            : nomeB.localeCompare(nomeA);
    });

    // Calcula o total de páginas
    const totalPaginas = Math.ceil(totalContatos / limite);

    // Renderiza a view com os dados corretos
    res.render('index', {
        contatos,
        totalContatos,
        ordem,
        termo,
        limite,
        paginaAtual: pagina,
        totalPaginas
    });
};

exports.exportar = async (req, res) => {
    const tipo = req.query.tipo;
    const userId = req.session.user._id;
    const ordem = req.query.ordem || 'asc';
    const termo = req.query.q || '';
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 5;
    const skip = (pagina - 1) * limite;

    try {
        let contatos;

        if (tipo === 'todos') {
            // Exporta todos os contatos, com ou sem filtro
            contatos = await Contato.buscaPorTermo(termo, userId, ordem, 0, 1000);
        } else if (tipo === 'pagina') {
            // Exporta apenas os contatos da página atual, com filtro aplicado
            contatos = await Contato.buscaPorTermo(termo, userId, ordem, skip, limite);
        } else {
            req.flash('errors', 'Tipo de exportação inválido.');
            return res.redirect('/');
        }

        if (!Array.isArray(contatos) || contatos.length === 0) {
            req.flash('errors', 'Nenhum contato encontrado para exportar.');
            return res.redirect('/');
        }

        const fonts = {
            Roboto: {
                normal: path.join(__dirname, '..', 'assets', 'fonts', 'Roboto-Regular.ttf'),
                bold: path.join(__dirname, '..', 'assets', 'fonts', 'Roboto-Medium.ttf'),
                italics: path.join(__dirname, '..', 'assets', 'fonts', 'Roboto-Italic.ttf')
            }
        };

        const printer = new PdfPrinter(fonts);

        const tabelaContatos = contatos.map((contato, index) => [
            { text: String(index + 1), alignment: 'center', margin: [0, 2, 0, 2] },
            { text: contato.nome || '', noWrap: false, margin: [0, 2, 0, 2] },
            { text: contato.sobrenome || '', noWrap: false, margin: [0, 2, 0, 2] },
            { text: contato.email || '', noWrap: false, margin: [0, 2, 0, 2] },
            { text: contato.telefone || '', margin: [0, 2, 0, 2] }
        ]);

        const dataHoraAtual = new Date().toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const docDefinition = {
            content: [
                {
                    image: path.join(__dirname, '..', 'assets', 'img', 'logo.png'),
                    width: 50,
                    alignment: 'left',
                    margin: [0, 0, 0, 10]
                },

                {
                    text: termo ? `Agenda de Contatos – Filtro: ${termo}` : 'Agenda de Contatos',
                    style: 'header',
                    margin: [0, 0, 0, 10]
                },
                {
                    text: `Gerado em: ${dataHoraAtual}`,
                    fontSize: 9,
                    italics: true,
                    alignment: 'right',
                    margin: [0, 0, 0, 20]
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', '25%', '20%', '30%', '25%'],
                        body: [
                            [
                                { text: '#', style: 'tableHeader', margin: [0, 2, 0, 2] },
                                { text: 'Nome', style: 'tableHeader', margin: [0, 2, 0, 2] },
                                { text: 'Sobrenome', style: 'tableHeader', margin: [0, 2, 0, 2] },
                                { text: 'Email', style: 'tableHeader', margin: [0, 2, 0, 2] },
                                { text: 'Telefone', style: 'tableHeader', margin: [0, 2, 0, 2] }
                            ],
                            ...tabelaContatos
                        ]
                    },
                    layout: 'lightHorizontalLines'
                }
            ],
            styles: {
                header: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 10,
                    color: 'black'
                }
            },
            defaultStyle: {
                font: 'Roboto',
                fontSize: 8,
                lineHeight: 1.0
            },
            footer: function (currentPage, pageCount) {
                return {
                    text: `Página ${currentPage} de ${pageCount}`,
                    alignment: 'center',
                    margin: [0, 10, 0, 0],
                    fontSize: 10
                };
            }
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const caminhoArquivo = path.join(__dirname, '..', 'agenda.pdf');
        const stream = fs.createWriteStream(caminhoArquivo);

        pdfDoc.pipe(stream);
        pdfDoc.end();

        stream.on('finish', () => {
            res.download(caminhoArquivo, 'agenda.pdf');
        });

    } catch (erro) {
        console.error('Erro ao gerar PDF:', erro.stack || erro);
        res.status(500).send('Erro interno ao gerar o PDF');
    }
};