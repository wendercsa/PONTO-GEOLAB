function baterPonto(tipo) {
  fetch('/bater-ponto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tipo })
  })
  .then(res => res.text())
  .then(msg => alert(msg))
  .catch(err => alert("Erro ao registrar ponto"));
}
