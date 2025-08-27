document.addEventListener('DOMContentLoaded', function () {
    const selectLimite = document.getElementById('limite');
    if (selectLimite) {
      selectLimite.addEventListener('change', function () {
        this.form.submit();
      });
    }
});