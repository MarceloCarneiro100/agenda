document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalDeleteTodos');
    if (modal) {
        modal.addEventListener('hide.bs.modal', () => {
            document.activeElement.blur();
        });
    }
});