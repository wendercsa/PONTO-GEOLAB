const express = require('express');
const app = express();

app.use(express.json());

// usuários fake (depois vamos para banco real)
let usuarios = [
  { id: 1, email: "admin@geolab.com.br", senha: "123456", tipo: "admin" },
  { id: 2, email: "funcionario@geolab.com.br", senha: "123456", tipo: "funcionario" }
];

// LOGIN
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const user = usuarios.find(u => u.email === email && u.senha === senha);

  if (!user) {
    return res.status(401).send("Usuário inválido");
  }

  res.json({
    mensagem: "Login realizado",
    usuario: user
  });
});

// ROTA TESTE
app.get('/', (req, res) => {
  res.send("Geolab Sistema de Ponto 🚀");
});

app.listen(3000, () => console.log("Rodando..."));
