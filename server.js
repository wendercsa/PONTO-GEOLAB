const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// 🔥 CONEXÃO COM MONGO
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo conectado"))
  .catch(err => console.log(err));

// 🔥 MODEL (estrutura do banco)
const PontoSchema = new mongoose.Schema({
  tipo: String,
  data: Date
});

const Ponto = mongoose.model('Ponto', PontoSchema);

// 🔥 ROTA HOME
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 🔥 SALVAR PONTO
app.post('/bater-ponto', async (req, res) => {
  const { tipo } = req.body;

  const novoPonto = new Ponto({
    tipo,
    data: new Date()
  });

  await novoPonto.save();

  res.send("Ponto registrado com sucesso!");
});

// 🔥 BUSCAR HISTÓRICO
app.get('/historico', async (req, res) => {
  const pontos = await Ponto.find().sort({ data: -1 });
  res.json(pontos);
});

// 🔥 SERVIDOR
app.listen(3000, () => {
  console.log("Rodando...");
});
