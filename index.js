const express = require('express');
const bodyParser= require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
  //res.send('Welcome to a little brain puzzle =)');
  console.log(__dirname + '/public/index.html')
  res.sendFile(__dirname + '/public/index.html')
});

app.post('/guess', (req, res) => {
  // Input validation
  console.log(req.body.number)
  console.log(!isNaN(req.body.number));
  res.send('Hej')
})

app.listen(3001, function() {
  console.log('listening on 3001')
})

