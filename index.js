const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo')(session);

app.use(express.urlencoded());

app.use(cookieParser());

// use express router
app.use('/', require('./routes'));


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
