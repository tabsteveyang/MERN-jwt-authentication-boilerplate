//// Start: set up environment constants.
const dotenv = require('dotenv');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development' });
}
//// End:   set up environment constants.

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { User, Group } = require('./mongodb/db');

const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));
app.use(bodyParser.json()); //the middleware is a must for receiving data from client-side.

//database API:
app.use('/admin/create_user', (req, res, next) => {
    const data = req.body;
    const user = new User(data);
    user.save().then((doc) => {
        res.send('success');
        next();
    }).catch((e) => {
        res.send(e);
	next();
    });
});
app.use('/user/check_token', (req, res, next) => {
    const token = req.body.token;
    //parse token.
    const data = jwt.decode(token);
    //find user by id.
    User.findById(data._id).then((userData) => {
        //check is the token exist in the tokens array.
        if(userData.tokens.indexOf(token) !== -1){
            res.send('success');
        }else{
            res.send('invalid');
        }
        next();
    }).catch((e) => {
        res.status(403).send('invalid');
        next();
    });
});
app.use('/user/login', (req, res, next) => {
    const data = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(data.email, data.password).then((userData) => {
        userData.generateAuthToken().then((token) => {
	    const {status, _id: uid, name, email, access, iat} = jwt.decode(token);
	    payload = {status, uid, name, email, access, iat};
            res.header('x-auth', token).send(payload);
            next();
        });
    }).catch((e) => {
        res.status(400).send();
        next();
    });
});
app.use('/user/logout', (req, res, next) => {
    const data = _.pick(req.body, ['uid', 'currentUsrJwt']);
    User.findById(data.uid).then((userData) => {
        userData.removeAuthToken(data.currentUsrJwt).then((response) => {
            //check the result.
            if(response.tokens.indexOf(data.token) === -1){
                res.send('success');
                next();
            }
        });
    }).catch((e) => {
        res.status(401).send('error');
        next();
    });
});

//client side reactJS routing:
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
  console.log('Server is up! Listening to the port: ', port);
});
