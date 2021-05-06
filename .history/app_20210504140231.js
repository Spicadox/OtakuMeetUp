const express = require('express');
const app = express();
app.set('view engine', 'ejs');
var session = require('express-session');
app.use('/assets', express.static('assets'));
app.use('/css', express.static('css'));
app.use('/views', express.static('views'));
const 
const connectionsRouter = require('./controllers/connectionController.js');
const mainRouter = require('./controllers/mainController.js');
const userRouter = require('./controllers/userController.js');


app.use(session({
    secret: 'secret-token',
    saveUninitialized: false,
    resave: false,
}));
//allow for body-parser
app.use(express.urlencoded({ extended: false }));


// Use the connectionsRouter for the connection and connections page
app.use(['/connections', '/connection', '/connections.ejs'], connectionsRouter);

// Use the connectionsRouter for the connection and connections page
app.use('/', userRouter);

// Use the mainRouter for all pages that are not connection or connections page
app.use('/', mainRouter);

// listen to port 3000
app.listen(3000);