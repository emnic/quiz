var express = require('express');
var bodyParser= require('body-parser')
var path = require('path');
var jsonfile = require('jsonfile')
var nodemailer = require('nodemailer');
var session = require('express-session');

var app = express();

app.use(session({
    secret: 'cookie_secret',
    name: 'awquiz',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));

var secret_number = 0;
var guess_counter = 0;
var prev_guess = 0;
var cons_corr_counter = 0;
var old_IP = 0;
var sess;

app.get('/guessreset', (req, res) => {

  sess = req.session;

  // Calculate the secret number
  sess.secret_number = Math.floor((Math.random() * 100) + 1)
  sess.guess_counter = 0;
  sess.cons_corr_counter = 0;
  sess.prev_guess = 0;
  console.log("Session: " + sess.id + ", Secret number: " + sess.secret_number);
  res.json({'result':200})
});

app.post('/guess', (req, res) => {
  // Input validation
  var user_guess = req.body.guess;
  sess = req.session;

  console.log("Session: " + sess.id + ", Secret number: " + sess.secret_number);
  console.log("Session: " + sess.id + ", User guess: " + user_guess);

  var result = 'Nope!!!';

  if(user_guess === 'help'){
  	if(sess.guess_counter < 100){
  		result = 'Have you given up allready'
  	}
  	else{ 
  		result = 'I can guarantee that the secret number is the same and not changed during the session'
  	}
  }
  else{
	  user_guess = parseInt(user_guess, 10);
	  if(sess.prev_guess === user_guess){
	  	result = 'Same as last guess, input a new number'
	  }
	  else if(sess.guess_counter % 8 === 7 && sess.cons_corr_counter > 0){
	  	sess.cons_corr_counter = 0;
	  	sess.guess_counter = 0;
	  	result = 'Was it only luck the last time you found the number. Resetting the "Correct guesses in a row" counter';
	  }   
	  else if(user_guess === sess.secret_number){
	  	sess.cons_corr_counter += 1; 
	  	if(sess.cons_corr_counter < 3){
	  		sess.secret_number = Math.floor((Math.random() * 100) + 1)
	  		console.log("Session: " + sess.id + ", Secret number: " + sess.secret_number);
	  		sess.guess_counter = 0;
	  		sess.prev_guess = 0;
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
	    else if(user_guess < sess.secret_number){
	      result = sess.guess_counter % 4 === 3 ? 'Too high':'Too low'
	    }
		else if(user_guess > sess.secret_number){
		  result = sess.guess_counter % 4 === 3 ? 'Too low':'Too high'
		}

		sess.guess_counter += 1;
	  }
  }

  sess.prev_guess = user_guess;
  

  res.json({'result':result,
			'guess_counter': sess.guess_counter,
			'cons_corr_counter': sess.cons_corr_counter})
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
app.post('/checkwinner', (req, res) => {
	var user = req.body;
	var file = 'data.json';
	var data = jsonfile.readFileSync(file);
	var secret_key = '';
	var mailstatus = false;
	var duplicate = false;

	for(i = 0; i < data.user.length; i++){
		if(data.user[i].email === user.email){
			duplicate = true;
		}
	}

	if(duplicate){
		message = 'The email address is allready registered. Are you trying to cheat?';
	}
	else{ 
		data.counter = data.counter + 1;
		data.user.push({'email': user.email, 'name': user.name, 'place': data.counter});
		jsonfile.writeFileSync(file, data)

		// Check for winning password
		if(data.counter == 1){
			secret_key = 'BESTÅ'
		}
		else if(data.counter == 2){
			secret_key = 'KALLAX'
		}
		else if(data.counter == 3){
			secret_key = 'TOMNÄS'
		}	

		if(data.counter <= 3){
			message = "Of course you are a winner and you are also one of the lucky three. You finished in place: " + data.counter + ", The secret password is: " + secret_key;
	  	}
	  	else{
	  		message = "Of course you are a winner but you are not one of the lucky three. Your position is: " +  data.counter;
	  	}
	  	 
	  	mail = createMail(user.name, data.counter, secret_key);
  	
  		sendConfirmMail(user, res, mail)
  		mailstatus = true;
	}
	console.log(message)
 	

  	res.json({'result':message, 'mailstatus':mailstatus})
});

function sendConfirmMail(user, res, mail) {
	// Not the movie transporter!
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'noreply.awquiz@gmail.com',
			pass: 'Test12345'
		}
	});


	
	var mailOptions = {
		from: 'noreply.awquiz@gmail.com', // sender address
		to: user.email, // list of receivers
		bcc: 'noreply.awquiz@gmail.com',
		subject: 'AW-quiz result', // Subject line
		text: mail //, // plaintext body
		// html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
	};
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
			console.log('ErrorError')
		//res.json({yo: 'error'});
		}else{
			console.log('Message sent: ' + info.response);
		};
	});
};

function createMail(name, place, secret_key){
	heading = 'Hi ' + name + '!\n\n'
	text = 'Thanks for participating. You finished at place: ' + place + '\n\n\n'
	extra_text = 'Your secret password is: ' + secret_key + '\n\n\n'
	ending = 'Best regards\nChristmas Party Committee'

	if (secret_key){
		mail = heading + text + extra_text + ending;
	}
	else{
		mail = heading + text + ending;
	}

	return mail;
}
app.listen(3001, function() {
 	console.log('listening on 3001')
})

