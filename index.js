const app = require('express')();

app.get('/', (req, res) => {
  //res.send('Welcome to a little brain puzzle =)');
  console.log(__dirname + '/public/index.html')
  res.sendFile(__dirname + '/public/index.html')
});

app.listen(3000, () => console.log('Server running'));
