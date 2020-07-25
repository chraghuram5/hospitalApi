const config=require('config');
const mongoose = require('mongoose');

//connect to mongodb
mongoose.connect(config.dbhost);

//fetch the connection
const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;