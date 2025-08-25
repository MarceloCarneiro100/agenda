import validator from 'validator';

export default class CadastroContato {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events();
    };

    events() {
        if (!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.validate(e);
        });
    };

    validate(e) {
        const el = e.target;
        const nomeInput = el.querySelector('input[name="nome"]');
        const emailInput = el.querySelector('input[name="email"]');
        const telefoneInput = el.querySelector('input[name="telefone"]');
        const inputs = el.querySelectorAll('.form-group .text-danger');

        inputs.forEach(input => {
            input.remove();
        });

        let error = false;

        if (!nomeInput.value.trim()) {
            const p = CadastroContato.createErrorMessage('Nome é um campo obrigatório.');
            nomeInput.insertAdjacentElement('afterend', p);
            error = true;
        }

        if (!emailInput.value.trim() && !telefoneInput.value.trim()) {
            const p = CadastroContato.createErrorMessage('Pelo menos um contato precisa ser enviado: e-mail ou telefone.');
            emailInput.insertAdjacentElement('afterend', p);
            telefoneInput.insertAdjacentElement('afterend', p);
            error = true;
        }

        if (emailInput.value.trim() && !validator.isEmail(emailInput.value.trim())) {
            const p = CadastroContato.createErrorMessage('E-mail inválido.');
            emailInput.insertAdjacentElement('afterend', p);
            error = true;
        }

        if (telefoneInput.value.trim()) {
            const telefoneValido = CadastroContato.validarTelefone(telefoneInput.value.trim());
            if (!telefoneValido) {
                const p = CadastroContato.createErrorMessage('Telefone inválido. Use o formato (xx)xxxxx-xxxx ou (xx)xxxx-xxxx.');
                telefoneInput.insertAdjacentElement('afterend', p);
                error = true;
            }
        }

        if (!error) el.submit();
    };


    static createErrorMessage(message) {
        const p = document.createElement('p');
        p.innerText = message;
        p.className = 'text-danger';
        p.style.fontWeight = '500';
        return p;
    }

    static validarTelefone(telefone) {
        // Remove espaços, parênteses, traços etc.
        const limpo = telefone.replace(/\D/g, '');

        // Valida se o número tem 10 (fixo) ou 11 (celular) dígitos, incluindo o DDD
        return /^(\d{10}|\d{11})$/.test(limpo);
    }

};