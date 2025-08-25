window.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('input[name="telefone"]');
  if (input) {
    const mask = new Inputmask({
      mask: ["(99)9999-9999", "(99)99999-9999"],
      placeholder: "_",
      showMaskOnHover: false,
      showMaskOnFocus: true,
      greedy: false
    });
    mask.mask(input);
  }
});
