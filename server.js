const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb+srv://admin:Geolab2026@cluster0.rhncglg.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("Mongo conectado"))
  .catch(err => console.log(err));

// 🔥 ESSENCIAL
app.use(express.json());
app.use(express.static('public'));

// 🔥 CONEXÃO MONGO
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo conectado"))
  .catch(err => console.log(err));

// 🔥 ROTA PRINCIPAL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 🔥 SALVAR PONTO
app.post('/bater-ponto', async (req, res) => {
  try {
    const { tipo } = req.body;

    const registro = {
      tipo,
      data: new Date()
    };

    await mongoose.connection.db
      .collection('pontos')
      .insertOne(registro);

    res.send("Ponto registrado com sucesso!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Erro ao salvar ponto");
  }
});

// 🔥 BUSCAR HISTÓRICO
app.get('/historico', async (req, res) => {
  try {
    const registros = await mongoose.connection.db
      .collection('pontos')
      .find()
      .sort({ data: -1 })
      .toArray();

    res.json(registros);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erro ao buscar histórico");
  }
});

// 🔥 PORTA CORRETA (IMPORTANTE NO RENDER)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Rodando na porta", PORT);
});
