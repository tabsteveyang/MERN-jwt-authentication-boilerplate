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
const { User } = require('./mongodb/db');
const { tokenChecker, priviligeChecker } = require('./helpers/auth');
const { writeLog } = require('../utils/logger');

const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;

const secure = require('ssl-express-www'); //force using ssl in prod.
if(process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development'){
    app.use(secure);
}
app.use(express.static(publicPath));
app.use(bodyParser.json()); //the middleware is a must for receiving data from client-side.

//database API:
app.use('/user/check_token', (req, res) => {
    const token = req.header('x-auth');
    if(!token || token === '' || token === 'undefined'){
        res.status(403).send('invalid');
        return;
    }
    //parse token.
    const data = jwt.decode(token);
    //find user by id.
    if(data){
        User.findById(data.uid).then((userData) => {
            //check is the token exist in the tokens array.
            if(userData.tokens.indexOf(token) !== -1){
                res.send('success');
            }else{
                res.status(403).send('invalid');
            }
        }).catch((e) => {
            writeLog(e, {file: 'server.js:47'});
            res.status(403).send('invalid');
        });
    }else{
        res.status(403).send('invalid');
    }
});
app.use('/user/login', (req, res) => {
    const data = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(data.email, data.password).then((userData) => {
        userData.generateAuthToken().then((token) => {
	    const {status, uid, name, email, access, iat} = jwt.decode(token);
	    payload = {status, uid, name, email, access, iat};
            res.header('x-auth', token).send(payload);
        });
    }).catch((e) => {
        writeLog(e, {file: 'server.js:63'});
        res.status(400).send('invalid');
    });
});
app.use('/user/logout', tokenChecker, (req, res) => {
    const uid = req.userInfo.uid;
    const currentUsrJwt = req.token;
    User.findById(uid).then((userData) => {
        userData.removeAuthToken(currentUsrJwt).then((response) => {
            //check the result.
            if(response.tokens.indexOf(currentUsrJwt) === -1){
                res.send('success');
            }
        });
    }).catch((e) => {
        writeLog(e, {file: 'server.js:78'});
        res.status(401).send('error');
    });
});
app.use('/admin/create_user', tokenChecker, (req, res) => {
    //check privilige:
    const allowAccess = priviligeChecker(req.userInfo.access, ['isAdmin']);
    if(!allowAccess){
        res.status(403).send('invalid');
        return;  //exit the function to make sure the user without privilige can't create a new user.
    }
    const data = req.body;
    const user = new User(data);
    user.save().then((doc) => {
        res.send('success');
    }).catch((e) => {
        writeLog(e, {file: 'server.js:94'});
        res.send('invalid');
    });
});

//client side reactJS SPA routing:
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
  const msg = `Server is up! Listening to the port: ${port}, in env: ${process.env.NODE_ENV}`;
  writeLog(msg, {type: 'sys'});
  console.log(msg);
});
