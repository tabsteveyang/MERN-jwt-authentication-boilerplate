const jwt = require('jsonwebtoken');
const { User } = require('../mongodb/db');
const { writeLog } = require('../utils/logger');

//middleware function:
//  similiar to the method that '/user/check_token' route will trigger but slightly different.
const tokenChecker = (req, res, next) => {
    const token = req.header('x-auth');
    if(!token || token === '' || token === 'undefined'){
        res.status(403).send('invalid');
        return; //exit the function after sending back status code and data.
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
            writeLog(e, {file: 'server/helper/auth.js:47'});
            //when there is an error while access the db -> block the request.
            res.status(403).send('invalid');
        });
    }else{
        //token is not in the correct form -> stop here.
        res.status(403).send('invalid');
    }
};

//helper function:
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

module.exports = { tokenChecker, priviligeChecker };
