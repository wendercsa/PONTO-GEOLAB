const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));
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
let registros = [];

app.post('/ponto', (req, res) => {
  const { tipo } = req.body;

  const registro = {
    tipo,
    data: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  };

  registros.push(registro);

  console.log(registro);

  res.send(`Ponto registrado: ${tipo} às ${registro.data}`);
});
app.listen(3000, () => console.log("Rodando..."));
