const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('dist'));

app.get('/qunit', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));

app.listen(3000, () => console.log('Serving your tests at http://localhost:3000'));
