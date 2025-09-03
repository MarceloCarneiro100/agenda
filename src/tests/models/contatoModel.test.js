const mongoose = require('mongoose');
const Contato = require('../../models/ContatoModel');

describe('ContatoModel - Validação', () => {
    it('deve retornar erro se nome estiver vazio', () => {
        const contato = new Contato({ email: 'teste@email.com' });
        contato.valida();
        expect(contato.errors).toContain('Nome é um campo obrigatório.');
    });

    it('deve retornar erro se email for inválido', () => {
        const contato = new Contato({ nome: 'João', email: 'email-invalido' });
        contato.valida();
        expect(contato.errors).toContain('E-mail inválido.');
    });

    it('deve retornar erro se email e telefone estiverem ausentes', () => {
        const contato = new Contato({ nome: 'João' });
        contato.valida();
        expect(contato.errors).toContain('Pelo menos um contato precisa ser enviado: e-mail ou telefone.');
    });

    it('deve retornar erro se telefone estiver em formato inválido', () => {
        const contato = new Contato({ nome: 'João', telefone: '123456' });
        contato.valida();
        expect(contato.errors).toContain('Telefone inválido. Use o formato (xx)xxxxx-xxxx ou (xx)xxxx-xxxx.');
    });
});

describe('ContatoModel - CleanUp', () => {
    it('deve limpar campos não string e gerar telefoneLimpo corretamente', () => {
        const contato = new Contato({
            nome: 123,
            sobrenome: null,
            email: undefined,
            telefone: '(21)98765-4321'
        });

        contato.cleanUp();

        expect(contato.body.nome).toBe('');
        expect(contato.body.sobrenome).toBe('');
        expect(contato.body.email).toBe('');
        expect(contato.body.telefoneLimpo).toBe('21987654321');
    });

    it('deve definir telefoneLimpo como vazio se telefone for undefined', () => {
        const contato = new Contato({ nome: 'João' });
        contato.cleanUp();
        expect(contato.body.telefoneLimpo).toBe('');
    });
});

describe('ContatoModel - Registro e Busca', () => {
    it('deve registrar um contato válido no banco', async () => {
        const contato = new Contato({
            nome: 'Maria',
            email: 'maria@email.com',
            telefone: '(21)99999-9999'
        });

        const userId = new mongoose.Types.ObjectId();
        await contato.register(userId);

        expect(contato.errors.length).toBe(0);
        expect(contato.contato).toHaveProperty('_id');
        expect(contato.contato.nome).toBe('Maria');
    });

    it('deve buscar contato por ID', async () => {
        const contato = new Contato({
            nome: 'Carlos',
            email: 'carlos@email.com',
            telefone: '(11)98888-8888'
        });

        const userId = new mongoose.Types.ObjectId();
        await contato.register(userId);

        const encontrado = await Contato.buscaPorId(contato.contato._id.toString());
        expect(encontrado.nome).toBe('Carlos');
    });

    it('deve apagar contato por ID e verificar que foi removido', async () => {
        const contato = new Contato({
            nome: 'Ana',
            email: 'ana@email.com',
            telefone: '(11)97777-7777'
        });

        const userId = new mongoose.Types.ObjectId();
        await contato.register(userId);

        const apagado = await Contato.delete(contato.contato._id.toString());
        expect(apagado.nome).toBe('Ana');

        const verificado = await Contato.buscaPorId(contato.contato._id.toString());
        expect(verificado).toBeNull();
    });

    it('deve editar um contato existente com dados válidos', async () => {
        const userId = new mongoose.Types.ObjectId();
        const contato = new Contato({ nome: 'Pedro', email: 'pedro@email.com', telefone: '(11)91234-5678' });
        await contato.register(userId);

        const atualizado = new Contato({ nome: 'Pedro Atualizado', telefone: '(11)99999-9999' });
        await atualizado.edit(contato.contato._id.toString());

        expect(atualizado.contato.nome).toBe('Pedro Atualizado');
        expect(atualizado.contato.telefone).toBe('(11)99999-9999');
    });
});

describe('ContatoModel - Busca por termo', () => {
    it('deve buscar contatos por nome', async () => {
        const userId = new mongoose.Types.ObjectId();

        const contato1 = new Contato({ nome: 'João', email: 'joao@email.com', telefone: '(11)99999-9999' });
        const contato2 = new Contato({ nome: 'Maria', email: 'maria@email.com', telefone: '(11)98888-8888' });

        await contato1.register(userId);
        await contato2.register(userId);

        const resultados = await Contato.buscaPorTermo('Maria', userId);
        expect(resultados.length).toBe(1);
        expect(resultados[0].nome).toBe('Maria');
    });

    it('deve buscar contatos por telefone limpo', async () => {
        const userId = new mongoose.Types.ObjectId();

        const contato = new Contato({ nome: 'Lucas', telefone: '(21)91234-5678' });
        await contato.register(userId);

        const resultados = await Contato.buscaPorTermo('21912345678', userId);
        expect(resultados.length).toBe(1);
        expect(resultados[0].nome).toBe('Lucas');
    });

    it('deve contar contatos por termo', async () => {
        const userId = new mongoose.Types.ObjectId();

        const contato1 = new Contato({ nome: 'João', email: 'joao@email.com', telefone: '(11)99999-9999' });
        const contato2 = new Contato({ nome: 'Maria', email: 'maria@email.com', telefone: '(11)98888-8888' });

        await contato1.register(userId);
        await contato2.register(userId);

        const total = await Contato.contarPorTermo('João', userId);
        expect(total).toBe(1);
    });
});

describe('ContatoModel - Métodos adicionais', () => {
    it('deve retornar todos os contatos de um usuário', async () => {
        const userId = new mongoose.Types.ObjectId();

        const contato1 = new Contato({ nome: 'A', telefone: '(11)91111-1111' });
        const contato2 = new Contato({ nome: 'B', telefone: '(11)92222-2222' });

        await contato1.register(userId);
        await contato2.register(userId);

        const lista = await Contato.buscaContatosPorUsuario(userId);
        expect(lista.length).toBe(2);
        expect(lista[0].userId.toString()).toBe(userId.toString());
    });

    it('deve apagar todos os contatos de um usuário', async () => {
        const userId = new mongoose.Types.ObjectId();
        const outroId = new mongoose.Types.ObjectId();

        await new Contato({ nome: 'X', telefone: '(11)93333-3333' }).register(userId);
        await new Contato({ nome: 'Y', telefone: '(11)94444-4444' }).register(userId);
        await new Contato({ nome: 'Z', telefone: '(11)95555-5555' }).register(outroId);

        await Contato.apagarTodosPorUsuario(userId);

        const restantes = await Contato.buscaContatosPorUsuario(userId);
        expect(restantes.length).toBe(0);

        const outros = await Contato.buscaContatosPorUsuario(outroId);
        expect(outros.length).toBe(1);
    });

    it('deve retornar contatos paginados corretamente', async () => {
        const userId = new mongoose.Types.ObjectId();

        for (let i = 0; i < 15; i++) {
            const numero = String(i).padStart(4, '0'); 
            await new Contato({
                nome: `Contato ${i}`,
                telefone: `(11)9${numero}-0000`
            }).register(userId);
        }

        const pagina1 = await Contato.buscaPaginadaPorUsuario(userId, 'asc', 0, 10);
        const pagina2 = await Contato.buscaPaginadaPorUsuario(userId, 'asc', 10, 10);

        expect(pagina1.length).toBe(10);
        expect(pagina2.length).toBe(5);
    });

    it('deve contar total de contatos por usuário', async () => {
        const userId = new mongoose.Types.ObjectId();

        await new Contato({ nome: 'A', telefone: '(11)91111-1111' }).register(userId);
        await new Contato({ nome: 'B', telefone: '(11)92222-2222' }).register(userId);
        await new Contato({ nome: 'C', telefone: '(11)93333-3333' }).register(userId);

        const total = await Contato.contatosPorUsuario(userId);
        expect(total).toBe(3);
    });
});