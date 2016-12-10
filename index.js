var express = require('express');
var bodyParser= require('body-parser')
var path = require('path');

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));

var secret_number = 0;
var guess_counter = 0;
var prev_guess = 0;
var cons_corr_counter = 0;

app.get('/guessreset', (req, res) => {

  // Calculate the secret number
  secret_number = Math.floor((Math.random() * 100) + 1)
  guess_counter = 0;
  cons_corr_counter = 0;

  console.log("Secret number: " + secret_number);
  res.json({'result':200})
});

app.post('/guess', (req, res) => {
  // Input validation
  var user_guess = req.body.guess;

  console.log("Secret number: " + secret_number);
  console.log("User guess: " + user_guess);

  var result = 'Nope!!!';

  if(user_guess === 'help'){
  	if(guess_counter < 100){
  		result = 'Have you given up allready'
  	}
  	else{ 
  		result = 'I can guarantee that the secret number is the same and not changed during the session'
  	}
  }
  else{
	  user_guess = parseInt(user_guess, 10);
	  if(prev_guess === user_guess){
	  	result = 'Same as last guess, input a new number'
	  }
	  else if(guess_counter % 8 === 7 && cons_corr_counter > 0){
	  	cons_corr_counter = 0;
	  	guess_counter = 0;
	  	result = 'Was it only luck the last time you found the number. Resetting the "Correct guesses in a row" counter';
	  }   
	  else if(user_guess === secret_number){
	  	cons_corr_counter += 1; 
	  	if(cons_corr_counter < 3){
	  		secret_number = Math.floor((Math.random() * 100) + 1)
	  		console.log(secret_number)
	  		guess_counter = 0;
		  	result = 'Congratulations! You found the secret number was it luck, or can you do it again?'
	  	}
	  	else{
	  		result = 'Congratulations! You found the pattern, the password to the next level is: "Liar-Liar"';
	  	}  	
	  }
	  else{
	  	user_guess = parseInt(user_guess, 10);
	  	if(user_guess < 1 || user_guess > 100){
	  		result = 'Hey!! I said between 1 and 100'
	  	} 
	    else if(user_guess < secret_number){
	      result = guess_counter % 4 === 3 ? 'Too high':'Too low'
	    }
		else if(user_guess > secret_number){
		  result = guess_counter % 4 === 3 ? 'Too low':'Too high'
		}

		guess_counter += 1;
	  }
  }

  prev_guess = user_guess;
  

  res.json({'result':result,
			'guess_counter': guess_counter,
			'cons_corr_counter': cons_corr_counter})
})
app.post('/checknav', (req, res) => {

	var key = req.body.secret;

	if(key === 'TIMSFORS'){
		result = 'ok';	
	}
	else if(key === 'Barcodes'){
		result = 'ok';	
	} 	
	else if(key === 'Liar-Liar'){
		result = 'ok';	
	} 
	else{
		result = 'Nope! Wrong Key';
	} 

	res.json({'result':result});
})


app.listen(3001, function() {
  console.log('listening on 3001')
})

