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
4. Create a admin user by following the schema of server/mongodb/schema/User.js file.
5. Run the command to build and start the server:
   You can also change node to nodemon instead(if nodemon is installed globally)
```
//for development build
$ yarn dev:dev && node server/server.js
```
```
//for development build
$ yarn dev:prod && node server/server.js
```
6. Open a browser and visit the website, login as the user that you just created.
