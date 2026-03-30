const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Sistema de Ponto Geolab rodando 🚀");
});

app.listen(3000, () => console.log("Rodando..."));
