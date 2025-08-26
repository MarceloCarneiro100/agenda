document.addEventListener('DOMContentLoaded', () => {
    // Lógica para configurar o botão de confirmação
    document.querySelectorAll('[data-bs-toggle="modal"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const contatoId = this.dataset.id;
            const confirmBtn = document.getElementById('confirmDeleteBtn');
            confirmBtn.href = `/contato/delete/${contatoId}`;
        });
    });

    // Lógica para remover o foco ao fechar o modal
    const modal = document.getElementById('confirmDeleteModal');
    if (modal) {
        modal.addEventListener('hide.bs.modal', () => {
            document.activeElement.blur();
        });
    }
});
