//Import packages
const express = require('express');
const bodyParser = require('body-parser');

//import from other files
const authRouter =require('./routes/signin');
const connectDB = require('./helpers/connectDB');
const auth = require('./routes/userRoutes');
const weather = require('./routes/weatherRoutes');

//init
const app = express();
var jsonParser = bodyParser.json();

//middleware
//used to manipulate data format from client side
//client -> middleware ->server ->client
app.use(jsonParser);
app.use(authRouter);
app.use(auth);
app.use(weather);
//app.use(express.json());

//binds itself to host and listen for any other connection
app.listen(process.env.PORT, () => {
    console.log(`connected at port ${process.env.PORT}`);
    connectDB()
}); //NEED to specify 0.0.0.0 for android

module.exports = { };
