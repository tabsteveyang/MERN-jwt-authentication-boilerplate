# MERN-jwt-authentication-boilerplate
This boilerplate is design to deploy on Heroku, you should tweak it if that is not your purpose. <br>
(Base on https://github.com/andrewjmead/react-course-2-boilerplate)

## How to start:
1. Set up the mongoDB server and run it.
2. Create your own .env.development file in the root directory of your project, with these value setting.
```
TOKEN_SALT=<the random salt value>
DBHOST=<the URI link to the NoSQL database>
```
3. Install the dependency:
```
$ yarn install
```
4. Create an admin user in the mongodb prompt by following the schema of server/mongodb/schema/User.js file.
5. Run the command to build and start the server:
   You can also change node to nodemon instead(if nodemon is installed globally)
```
//for development build
$ yarn dev:dev && node server/server.js
```
```
//for production build
$ yarn dev:prod && node server/server.js
```
6. Open a browser and visit the website, login as the user that you just created.

## Protection of the routes:
### Front-End:
import the src/routers/AuthChecker component and place it in the render method in the page component which needs to be protected. <br>
#### AuthCheck component accepts 3 attributes:
* history(Object): The history object for redirecting users.<br>
* isPublic(Boolean): If the page should not be accessable when the user is not login then it should be false.<br>
* accessRequire(String)(Optional): The privilege that a user should have to access the page. Can send more then one requirement by seperating them by a comma(,) . <br> 
<br>
For example: 

``` javascript
// src/components/DashboardPage.js

import React from 'react';
import Navbar from './Navbar';
import LogoutBtn from './utils/LogoutBtn';
import AuthChecker from '../routers/AuthChecker';

const DashboardPage = (props) => ( 
    <div className="container-fluid">
        <AuthChecker history={props.history} isPublic={false}/>
        <Navbar />
        <LogoutBtn />
        <h1>Dashboard page content</h1>
    </div>
);

export default DashboardPage;
```

### Back-End:
Apply the middleware in a route and run the helper function in the begening of the callback function can protect a route. <br>
<br>
For example:

``` javascript
// server/server.js
// tokenChecker is the middleware for checking the tokens.
// priviligeChecker is the helper function for checking the priviliges.

app.use('/admin/create_user', tokenChecker, (req, res) => {
    //check privilige:
    const allowAccess = priviligeChecker(req.userInfo.access, ['isAdmin']);
    if(!allowAccess){
        res.status(403).send('invalid');
        return;  //exit the function to make sure the user without privileges can't create a new user.
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
```
