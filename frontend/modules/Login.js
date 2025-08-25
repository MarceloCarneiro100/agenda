import validator from 'validator';

export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events();
    }

    events() {
        if (!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.validate(e);
        });
    }

    validate(e) {
        const el = e.target;
        const emailInput = el.querySelector('input[name="email"]');
        const passwordInput = el.querySelector('input[name="password"]');
        const messageErrorsEl = el.querySelectorAll('.form-group .text-danger');

        messageErrorsEl?.forEach(messageEl => {
            messageEl.remove();
        });

        let error = false;

        if (!validator.isEmail(emailInput.value.trim())) {
            const p = Login.createErrorMessage('E-mail inválido.');
            emailInput.insertAdjacentElement('afterend', p);
            error = true;
        }

        if (passwordInput.value.trim().length < 3 || passwordInput.value.trim().length > 50) {
            const p = Login.createErrorMessage('A senha deve ter entre 3 e 50 caracteres.');
            passwordInput.insertAdjacentElement('afterend', p);
            error = true;
        }

        if (!error) el.submit();

    }

    static createErrorMessage(message) {
        const p = document.createElement('p');
        p.innerText = message;
        p.className = 'text-danger';
        p.style.fontWeight = '500';
        return p;
    }
}