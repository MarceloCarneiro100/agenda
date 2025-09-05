const request = require('supertest');
const app = require('../../../app');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const LoginModel = require('../../models/LoginModel');
const ContatoModel = require('../../models/ContatoModel');

let agent;
let userId;

beforeAll(async () => {
    agent = request.agent(app);

    const login = new LoginModel({ email: 'teste@teste.com', password: '123456' });
    await login.register();
    userId = login.user._id;

    await agent
        .post('/login/login')
        .set('Content-Type', 'application/json')
        .send({ email: 'teste@teste.com', password: '123456' });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('ContatoController - Integração', () => {
    it('deve registrar um contato com dados válidos', async () => {
        const res = await agent
            .post('/contato/register')
            .send({
                nome: 'Marcelo',
                email: 'marcelo@email.com',
                telefone: '(21)91234-5678'
            });

        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toMatch(/\/contato\/index\/.+/);
    });

    it('deve editar um contato existente', async () => {
        const contato = new ContatoModel({
            nome: 'Antigo',
            email: 'antigo@email.com',
            telefone: '(21)90000-0000',
            userId
        });
        await contato.register(userId);

        const res = await agent
            .post(`/contato/edit/${contato.contato._id}`)
            .send({
                nome: 'Atualizado',
                telefone: '(21)99999-9999'
            });

        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe(`/contato/index/${contato.contato._id}`);
    });

    it('deve apagar um contato existente', async () => {
        const contato = new ContatoModel({
            nome: 'Apagar',
            telefone: '(21)91111-1111',
            userId
        });
        await contato.register(userId);

        const res = await agent.get(`/contato/delete/${contato.contato._id}`);
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/');
    });

    it('deve exportar contatos como CSV', async () => {
        const contato = new ContatoModel({
            nome: 'CSV Teste',
            telefone: '(21)92222-2222',
            userId
        });
        await contato.register(userId);

        const res = await agent.get('/contato/exportar-csv');
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toContain('text/csv');
        expect(res.text).toContain('"nome","sobrenome","email","telefone"');
    });

    it('deve apagar todos os contatos do usuário', async () => {
        const contato1 = new ContatoModel({ nome: 'X', telefone: '(21)93333-3333', userId });
        const contato2 = new ContatoModel({ nome: 'Y', telefone: '(21)94444-4444', userId });
        await contato1.register(userId);
        await contato2.register(userId);

        const res = await agent.get('/contato/delete-todos');
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/');

        const restantes = await ContatoModel.buscaContatosPorUsuario(userId);
        expect(restantes.length).toBe(0);
    });

    it('deve buscar contatos por termo', async () => {
        const contato = new ContatoModel({
            nome: 'BuscaMarcelo',
            telefone: '(21)95555-5555',
            userId
        });
        await contato.register(userId);

        const res = await agent.get('/contato/busca?q=BuscaMarcelo');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('BuscaMarcelo');
    });

    it('deve importar contatos via CSV válido', async () => {
        const csvContent = `nome,sobrenome,email,telefone
                            Marcelo,Silva,marcelo@email.com,(21)99999-9999
                            Joana,Santos,joana@email.com,(21)98888-8888`;

        const filePath = path.join(__dirname, 'mock.csv');
        fs.writeFileSync(filePath, csvContent);

        const res = await agent
            .post('/contato/importar-csv')
            .attach('csvFile', filePath);

        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/contato/importar-csv');

        fs.unlinkSync(filePath); // limpa o arquivo após o teste
    });

    it('deve exportar contatos como PDF', async () => {
        const contato = new ContatoModel({
            nome: 'PDF Teste',
            telefone: '(21)97777-7777',
            userId
        });
        await contato.register(userId);

        const res = await agent.get('/contato/exportar?tipo=todos');
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-disposition']).toContain('attachment');
    });

});