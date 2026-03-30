const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000, () => {
  console.log('Rodando...');
});

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Mongo conectado"))
.catch(err => console.log(err));
