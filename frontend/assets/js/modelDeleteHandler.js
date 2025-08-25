document.querySelectorAll('[data-bs-toggle="modal"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const contatoId = this.dataset.id;
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        confirmBtn.href = `/contato/delete/${contatoId}`;
    });
});
