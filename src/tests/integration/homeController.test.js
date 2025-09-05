const request = require('supertest');
const app = require('../../../app');

describe('HomeController - Integração', () => {
    it('deve renderizar a página inicial com contatos paginados', async () => {
        const agent = request.agent(app);

        // Registra e loga o usuário
        await agent
            .post('/login/register')
            .set('Content-Type', 'application/json')
            .send({ email: 'marcelo@email.com', password: '123456' });

        await agent
            .post('/login/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'marcelo@email.com', password: '123456' });

        // Agora acessa a home com sessão ativa
        const res = await agent.get('/?pagina=1&limite=5');

        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Contato'); // ou qualquer conteúdo da home
    });
});