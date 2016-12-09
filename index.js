var express = require('express');
var bodyParser= require('body-parser')
var path = require('path');

var app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));
//app.set('public', path.join(__dirname, 'public'));
//app.use('/public',express.static(path.join(__dirname, 'public')));

secret_number = 0;
guess_counter = 0;
prev_guess = 0;

app.get('/', (req, res) => {
  // Calculate the secret number
  secret_number = Math.floor((Math.random() * 100) + 1)
  guess_counter = Math.floor((Math.random() * 4) + 1);
console.log(secret_number);
  res.sendFile(__dirname + '/public/index.html')
});

app.get('/first', (req, res) => {

  
  res.sendFile(__dirname + '/public/first.html')
});

app.post('/guess', (req, res) => {
  // Input validation
  //console.log(req.body.number)
  //console.log(!isNaN(req.body.number));
  user_guess = req.body.number;
  console.log(user_guess)
  console.log(secret_number);

  result = 0;
  user_guess = parseInt(user_guess, 10);
  if(prev_guess === user_guess){
  	result = 'same'
  } 
  else if(user_guess === secret_number){
  	result = 'equal'
  }
  else{
    if(user_guess < secret_number){
      result = guess_counter % 4 === 0 ? 'high':'low'
    }
	else if(user_guess > secret_number){
	  result = guess_counter % 4 === 0 ? 'low':'high'
	}

	guess_counter += 1;
  }

  prev_guess = user_guess;
  

  res.json({'result':result})
})

app.listen(3001, function() {
  console.log('listening on 3001')
})

