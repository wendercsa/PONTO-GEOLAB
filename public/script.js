function login() {
  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('email').value,
      senha: document.getElementById('senha').value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.mensagem === "Login realizado") {
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      window.location.href = "home.html";
    } else {
      document.getElementById('msg').innerText = "Erro no login";
    }
  });
}

function registrar(tipo) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  fetch('/ponto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tipo, email: usuario.email })
  })
  .then(res => res.text())
  .then(msg => {
    document.getElementById('msg').innerText = msg;
  });
}

function carregarEspelho() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  fetch('/registros/' + usuario.email)
  .then(res => res.json())
  .then(data => {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    data.forEach(r => {
      const item = document.createElement("li");
      item.innerText = `${r.tipo} - ${r.data}`;
      lista.appendChild(item);
    });
  });
}
