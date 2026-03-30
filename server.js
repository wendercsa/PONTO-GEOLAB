const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// USUÁRIOS (simples por enquanto)
let usuarios = [
  { id: 1, email: "admin@geolab.com.br", senha: "123456" },
  { id: 2, email: "funcionario@geolab.com.br", senha: "123456" }
];

// LOGIN
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const user = usuarios.find(u => u.email === email && u.senha === senha);

  if (!user) {
    return res.status(401).json({ mensagem: "Usuário inválido" });
  }

  res.json({
    mensagem: "Login realizado",
    usuario: user
  });
});

// REGISTROS DE PONTO
let registros = [];

app.post('/ponto', (req, res) => {
  const { tipo, email } = req.body;

  const registro = {
    email,
    tipo,
    data: new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo'
    })
  };

  registros.push(registro);

  console.log(registro);

  res.send(`Ponto registrado: ${tipo} às ${registro.data}`);
});

// LISTAR REGISTROS (ESPelho)
app.get('/registros/:email', (req, res) => {
  const email = req.params.email;

  const dados = registros.filter(r => r.email === email);

  res.json(dados);
});

// ROTA TESTE
app.get('/', (req, res) => {
  res.send("Geolab Sistema de Ponto 🚀");
});

app.listen(3000, () => console.log("Rodando..."));
