const request = require('supertest');
const app = require('../../../app');

describe('LoginController - Integração', () => {

    it('deve registrar um novo usuário com dados válidos', async () => {
        const res = await request(app)
            .post('/login/register')
            .send({ email: 'marcelo@email.com', password: '123456' });

        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/login/index');
    });

    it('deve autenticar usuário com credenciais válidas', async () => {
        const agent = request.agent(app);

        await agent
            .post('/login/register')
            .set('Content-Type', 'application/json')
            .send({ email: 'marcelo@email.com', password: '123456' });

        await agent
            .post('/login/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'marcelo@email.com', password: '123456' });

        const res = await agent.get('/login/index');
        expect(res.text).toContain('Olá, marcelo@email.com!');
    });


    it('deve encerrar a sessão ao fazer logout', async () => {
        const agent = request.agent(app);

        await agent
            .post('/login/login')
            .send({ email: 'marcelo@email.com', password: '123456' });

        const res = await agent.get('/login/logout');

        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/login/index');
    });
});