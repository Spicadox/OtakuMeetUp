const express = require('express');
const Connection = require('../models/connection');
const User = require('../models/user');
const UserProfile = require('../models/userProfile');
const UserConnection = require('../models/userConnection');
const router = express.Router();

// Create the connectionDB object and set all the hardcoded connections to the connections variable
const connectionDB = require('../utils/connectionDB');
let connectDB = new connectionDB();
let connections = connectDB.getConnections();

// Middleware that checks for the user's session and forces login on session required url
router.use('/', function (req, res, next) {
    // console.log(!req.session.user);
    if (!req.session.user && req.url == '/newConnection' && req.url == '/savedConnections') {
        res.render('login');
    }
    else {
        next();
    }
});

// Post request for logging in
router.post(['/login', '/login.ejs'], function (req, res) {
    // Create a dummy user that only dynamically takes in the username provided
    if (req.body.email != undefined) {
        req.session.user = new User(01, "John", "Doe", req.body.email);
    }
    else {
        req.session.user = new User(01, "John", "Doe", "johnDoe@gmail.com");
    }
    let newUserProfile = new UserProfile(req.session.user);
    req.session.userProfile = newUserProfile;
    res.redirect('savedConnections');
    // res.render('savedConnections', { userProfile: req.session.userProfile });
});

// Post request 
router.post(['/savedConnections'], function (req, res) {
    // for adding/update userconnections if the previous page is /connection
    // meaning the update button wasn't pressed on savedConnections page
    if (req.session.previousPath == "/connection") {
        if (req.session.userProfileConnections === undefined) {
            req.session.userProfileConnections = [];
        }

        let newUserProfile = new UserProfile(req.session.user, req.session.userProfileConnections);
        let parsedConnection = JSON.parse(req.body.connection);
        let newConnection = new Connection(parsedConnection._id, parsedConnection._title, parsedConnection._category, parsedConnection._details, parsedConnection._dateTime, parsedConnection._location);
        newUserProfile.addConnection(newConnection, req.body.rsvp)

        req.session.userProfileConnections = newUserProfile.userConnections;

        res.render("savedConnections", { userProfile: req.session.userProfileConnections, req: req });
    }
    // for updating the RSVP if update button was clicked
    else if (req.session.previousPath == "/savedConnections") {
        let newUserProfile = new UserProfile(req.session.user, req.session.userProfileConnections);

        newUserProfile.updateRSVP(req.session.updateID, req.body.rsvp)

        req.session.userProfileConnections = newUserProfile.userConnections;

        res.render("savedConnections", { userProfile: req.session.userProfileConnections, req: req });
    }
});

// routes to the savedConnections page
router.get(['/savedConnections', '/savedConnections.ejs'], function (req, res) {
    res.render("savedConnections", { userProfile: req.session.userProfileConnections, req: req });
});

// routes to the savedConnections page after deleting a userConnection
router.post(['/deleted'], function (req, res) {
    let newUserProfile = new UserProfile(req.session.user, req.session.userProfileConnections);
    newUserProfile.removeConnection(req.body.deleteID);
    req.session.userProfileConnections = newUserProfile.userConnections;

    res.render("savedConnections", { userProfile: req.session.userProfileConnections, req: req });
});

// routes to the specific connection after clicking the update button
router.post('/update', function (req, res) {
    req.params._id = req.body.updateID;
    req.session.updateID = req.body.updateID;
    console.log(req.session.updateID);
    req.session.previousPath = "/savedConnections";
    // if it's a valid connection
    if (connections.length != 0 && typeof (connections) != 'undefined') {
        // if there are no query parameters then just display the connections page
        if (Object.keys(req.query).length === 0) {
            res.render('connections', { connections: connections, req: req });
        }
        // else display the specific connection
        else {
            for (let i = 0; i < connections.length; i++) {
                // if the ?id= parameter matches a connection's id then display the connection page
                if (req.query.id == connections[i].getID()) {
                    req.query.id = connections[i].getID()
                    res.render('connection', { connection: connections[i], req: req });
                }
            }
        }
    }
});

// routes to the logout page and reset session data
router.get(['/logout', '/logout.ejs'], function (req, res) {
    // res.render("logout", { req: req });
    if (req.session.userProfileConnections != undefined) {
        req.session.userProfileConnections = undefined;
    }
    req.session.destroy();
    req.session = undefined;
    res.render("logout", { req: req });
});


module.exports = router;
