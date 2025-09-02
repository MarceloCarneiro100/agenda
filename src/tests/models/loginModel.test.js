const Login = require('../../models/LoginModel');

describe('LoginModel - register()', () => {
    it('deve criar um usuário válido', async () => {
        const login = new Login({ email: 'teste@teste.com', password: '123456' });
        await login.register();

        expect(login.errors.length).toBe(0);
        expect(login.user).toHaveProperty('_id');
        expect(login.user.password).not.toBe('123456');
    });

    it('não deve criar usuário com e-mail inválido', async () => {
        const login = new Login({ email: 'invalido', password: '123456' });
        await login.register();

        expect(login.errors).toContain('E-mail inválido.');
    });
});


describe('LoginModel - login()', () => {
    it('deve autenticar usuário válido', async () => {
        const login = new Login({ email: 'teste@teste.com', password: '123456' });
        await login.register();

        const login2 = new Login({ email: 'teste@teste.com', password: '123456' });
        await login2.login();

        expect(login2.errors.length).toBe(0);
        expect(login2.user).not.toBeNull();
    });

    it('deve falhar com senha errada', async () => {
        const login = new Login({ email: 'teste@teste.com', password: 'errada' });
        await login.login();

        expect(login.errors).toContain('Senha inválida');
    });
});


describe('Método cleanUp', () => {
    it('deve transformar valores não-string em strings vazias', () => {
        const login = new Login({ email: 123, password: {} });
        login.cleanUp();

        expect(login.body).toEqual({
            email: '',
            password: ''
        });
    });

    it('deve manter strings válidas', () => {
        const login = new Login({ email: 'teste@teste.com', password: '123456' });
        login.cleanUp();

        expect(login.body).toEqual({
            email: 'teste@teste.com',
            password: '123456'
        });
    });
});

describe('Método valida', () => {
    it('deve adicionar erro se o email for inválido', () => {
        const login = new Login({ email: 'email-invalido', password: '123456' });
        login.valida();

        expect(login.errors).toContain('E-mail inválido.');
    });

    it('deve adicionar erro se a senha for muito curta', () => {
        const login = new Login({ email: 'teste@teste.com', password: '12' });
        login.valida();

        expect(login.errors).toContain('A senha precisa ter entre 3 e 50 caracteres.');
    });

    it('não deve adicionar erros com dados válidos', () => {
        const login = new Login({ email: 'teste@teste.com', password: '123456' });
        login.valida();

        expect(login.errors.length).toBe(0);
    });
});