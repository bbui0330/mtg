document.getElementById('textBox').addEventListener('input', function() {
  const text = this.value;
  document.getElementById('output').textContent = `You typed: ${text}`;
});