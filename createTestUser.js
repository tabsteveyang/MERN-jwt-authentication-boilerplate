//// Start: set up environment constants.
const dotenv = require('dotenv');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development' });
}
//// End:   set up environment constants.

const { User } = require('./server/mongodb/db');
const fs = require('fs');

const admin = new User({
    "pic" : "",
    "tokens" : [],
    "email" : "testadmin@mail.com",
    "password" : "mypassword",
    "name" : "testadmin",
    "settings" : [ 
        {
            "language" : "EN",
        }
    ],
    "privilige" : [ 
        {
            "isActivate" : true,
            "setting" : true,
            "create" : true,
            "isAdmin" : true,
        }
    ],
});

const oripasswd = admin.password;

admin.save().then((userData) => {
    console.log(`Test admin user has been created, \n Please log in as '${admin.email}' with the password '${oripasswd}'.\n`);
    fs.unlink('./createTestUser.js', (err) => {
        console.log("Work done! Try to clean up the script...\n");
        if(err) throw err;
        console.log("The script is deleted, cheers!\n");
        process.exit();
    });   
}).catch((e) => {
    console.log("Oops! something went wrong: \n", e);
    process.exit();
});
