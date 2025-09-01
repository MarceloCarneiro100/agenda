document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-bs-toggle="modal"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const contatoId = this.dataset.id;
      const confirmBtn = document.getElementById('confirmDeleteBtn');

      if (contatoId && confirmBtn) {
        e.preventDefault();
        confirmBtn.href = `/contato/delete/${contatoId}`;
      }
    });
  });

  const modal = document.getElementById('confirmDeleteModal');
  if (modal) {
    modal.addEventListener('hide.bs.modal', () => {
      document.activeElement.blur();
    });
  }
});

