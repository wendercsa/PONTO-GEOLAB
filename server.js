const express = require('express');
const mongoose = require('mongoose');

const app = express();

// IMPORTANTE: permite receber JSON
app.use(express.json());

// arquivos estáticos
app.use(express.static('public'));

// rota principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// conexão com Mongo
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Mongo conectado"))
.catch(err => console.log(err));

// rota de bater ponto
app.post('/bater-ponto', async (req, res) => {
  const { tipo } = req.body;

  const registro = {
    tipo,
    data: new Date()
  };

  console.log(registro);

  res.send("Ponto registrado com sucesso!");
});

// PORTA DO RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Rodando...");
});
