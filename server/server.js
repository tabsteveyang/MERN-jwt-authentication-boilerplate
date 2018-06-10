const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { User, Group } = require('./mongodb/db');

const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));
app.use(bodyParser.json()); //the middleware is a must for receiving data from client-side.

//database API:
app.use('/create_user', (req, res, next) => {
    let data = req.body;
//console.log(data);
    let user = new User(data);
    user.save().then((doc) => {
        res.send('success');
        next();
    }).catch((e) => {
        res.send(e);
	next();
    });
});

//client side reactJS routing:
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
  console.log('Server is up!');
});
