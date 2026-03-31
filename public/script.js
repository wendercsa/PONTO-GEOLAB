function baterPonto(tipo) {
  const nome = localStorage.getItem('nome');
  const usuario = localStorage.getItem('usuario');

  if (!nome || !usuario) {
    alert("Erro: usuário não identificado");
    window.location.href = "login.html";
    return;
  }

  fetch('/bater-ponto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tipo,
      nome,
      usuario
    })
  })
  .then(res => res.text())
  .then(msg => alert(msg))
  .catch(err => alert("Erro ao registrar ponto"));
}
