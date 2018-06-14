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

///////middleware function:
//  similiar to the method that '/user/check_token' route will trigger but slightly different.
const tokenChecker = (req, res, next) => {
    const token = req.header('x-auth');
    if(!token || token === '' || token === 'undefined'){
        res.status(403).send('invalid');
        return;
    }
    //parse token.
    const data = jwt.decode(token);
    if(data){
        //find user by id.
        User.findById(data.uid).then((userData) => {
            //check is the token exist in the tokens array.
            if(userData.tokens.indexOf(token) !== -1){
                //token is valid -> keep going.
                req.userInfo = data;
                req.token = token;
                next();
            }else{
                //token is not valid -> stop here.
                return Promise.reject();
            }
        }).catch((e) => {
            //when there is an error while access the db -> block the request.
            res.status(403).send('invalid');
        });
    }else{
        //token is not in the correct form -> stop here.
        res.status(403).send('invalid');
    }
};
///////helper function:
const priviligeChecker = (access, require) => {
    if(access){
        const len = require.length;
        for(let i = 0; i < len; i++){
            if(access[require[i]] === false)
                return false;
        }
    }else{
        return false;
    }

    return true;
};
///////

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
        res.send(e);
    });
});

//client side reactJS SPA routing:
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
  console.log('Server is up! Listening to the port: ', port);
});
