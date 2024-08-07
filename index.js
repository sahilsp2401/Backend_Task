const express = require('express');
const connectToMongo = require('./db');
var cors = require('cors');


connectToMongo();
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.use('/api/auth',require('./routes/auth.js'));
app.use('/api/friendReq',require('./routes/friendReq.js'));
app.use('/api/post',require('./routes/post.js'));

app.listen(port, () => {
  console.log(`Listening on port number ${port}`)
})