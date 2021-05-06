const express = require('express');
const Connection = require('../models/connection-model');
const User = require('../models/user-model');
const UserProfile = require('../models/userProfile-model');
const UserConnection = require('../models/userConnection-model')
const router = express.Router();

// Create the connectionDB object and set all the hardcoded connections to the connections variable
// const connectionDB = require('../utils/connectionDB');
const Mongoose = require('mongoose');
// let connectDB = new connectionDB();


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

var queryUserProfile;
var queryUser;
// Post request for signing up
router.post(['/signup', 'signup.ejs'], function (req, res) {
    User.findOne({ fName: req.body.fName, lName: req.body.lName, email: req.body.email, password: req.body.password })
        .then((queryResult) => {
            // if no user found then add user
            console.log(queryResult);
            if (queryResult == null) {
                new User({ fName: req.body.fName, lName: req.body.lName, email: req.body.email, password: req.body.password }).save()
                    .then((newUser) => {
                        new UserProfile({ user: newUser, userConnections: new UserConnection() }).save()
                            .then((userProfile) => queryUserProfile = userProfile)
                            .catch((err) => console.log(err));
                    });

                console.log('Successfully added user');
                res.redirect('login');
            }
            // give an alert that user already exist
            else {
                console.log('failed to add user')
                res.redirect('signup');
            }
        })
        .catch((err) => {
            console.log(err);
        });
})


// Post request for logging in
router.post(['/login', '/login.ejs'], async function (req, res) {
    try {
        var queryUser = await User.findOne({ email: req.body.email, password: req.body.password });
    }
    catch (err) {
        console.log(err);
    }

    if (queryUser) {
        try {
            queryUserProfile = await UserProfile.findOne({ user: queryUser });
        }
        catch (err) {
            console.log(err);
        }

        // console.log("querying userprofile")
        // console.log(queryUserProfile)
        try {
            req.session.user = queryUser;
            req.session.userProfile = queryUserProfile;
            req.session.userProfileConnections = await queryUserProfile.getConnections();
        } catch (err) {
            console.log(err)
        }

        res.render('savedConnections', { userProfile: req.session.userProfileConnections, req: req });

    }
    // sent incorrect email or passcode message
    else {
        // alert("Incorrect Email or Passcode");
        res.redirect('login');
    }


    // res.render('savedConnections', { userProfile: req.session.userProfile });
});

// Post request to display all the user connections on the savedConnections page
router.post(['/savedConnections'], async function (req, res) {
    // if not logged in
    if (queryUserProfile == undefined) {
        res.redirect('signup');
    }
    let newUserProfile = queryUserProfile;
    console.log(newUserProfile);
    if (req.session.previousPath == "/connection") {

        let parsedConnection = JSON.parse(req.body.connection);

        let newConnection = new Connection({
            _id: parsedConnection._id,
            title: parsedConnection.title,
            category: parsedConnection.category,
            details: parsedConnection.details,
            dateTime: parsedConnection.dateTime,
            location: parsedConnection.location
        });
        let newUserConnection = new UserConnection({ _id: Mongoose.Types.ObjectId(), connection: newConnection, rsvp: req.body.rsvp });
        newUserConnection.save();

        try {
            await newUserProfile.addConnection(newUserConnection);
            console.log('Adding user connection');
        } catch (err) {
            console.log(err);
        }


        try {
            console.log('Getting user connections');
            req.session.userProfileConnections = await newUserProfile.getConnections();
            console.log('Got user Connections');
            console.log(req.session.userProfileCOnnections);
        } catch (err) {
            console.log(err);
        }
        console.log('')
        res.render("savedConnections", { userProfile: req.session.userProfileConnections, req: req });
    }
    // for updating the RSVP if update button was clicked
    else if (req.session.previousPath == "/savedConnections") {

        // req.session.userProfileConnections = newUserProfile.userConnections;
        try {
            console.log(req.session.connection);
            await newUserProfile.updateRSVP(req.session.updateID, req.body.rsvp);
        } catch (err) {
            console.log(err);
        }
        try {
            req.session.userProfileConnections = await newUserProfile.getConnections();
        } catch (err) {
            console.log(err)
        }
        res.render("savedConnections", { userProfile: req.session.userProfileConnections, req: req });
    }
});

// routes to the savedConnections page
router.get(['/savedConnections', '/savedConnections.ejs'], function (req, res) {
    res.render("savedConnections", { userProfile: req.session.userProfileConnections, req: req });
});

// routes to the savedConnections page after deleting a userConnection
router.post(['/deleted'], async function (req, res) {
    try {
        console.log(req.session.connection);
        await queryUserProfile.removeConnection(req.body.deleteID);
        console.log("DONE UPDATING")
    } catch (err) {
        console.log(err);
    }
    try {
        req.session.userProfileConnections = await queryUserProfile.getConnections();
        console.log("GETTING CONNECTIONS")
    } catch (err) {
        console.log(err)
    }

    res.render("savedConnections", { userProfile: req.session.userProfileConnections, req: req });
});

// routes to the specific connection after clicking the update button
router.post('/update', async function (req, res) {
    req.params._id = req.body.updateID;
    req.session.updateID = req.body.updateID;

    let connection = await Connection.findOne({ _id: req.params._id });
    req.session.connection = connection;
    req.session.previousPath = "/savedConnections";
    res.render('connection', { connection: connection, req: req });
});

// routes to users' connections page after creating a new connection
router.post('/newConnection', async function (req, res) {
    console.log("POSTING NEW CONNECTION")
    let newConnection = new Connection({
        title: req.body.name,
        category: req.body.topic,
        details: req.body.details,
        dateTime: req.body.when,
        location: req.body.where
    });
    newConnection.save();

    let newUserConnection = new UserConnection({
        connection: newConnection,
        rsvp: "Yes"
    });
    newUserConnection.save();

    console.log("NEW CONNECTION");
    console.log(newConnection);
    try {
        await queryUserProfile.addConnection(newUserConnection);
        console.log("ADDING CONNECTION")
    }
    catch (err) {
        console.log(err);
    }

    try {
        req.session.userProfileConnections = await queryUserProfile.getConnections();
        console.log("GETTING CONNECTIONS")
    } catch (err) {
        console.log(err);
    }
    res.render('savedConnections', { userProfile: req.session.userProfileConnections, req: req })

});

// routes to the newConnection page
router.get(['/newConnection', '/newConnection.ejs'], function (req, res) {
    // if not logged in
    if (queryUserProfile == undefined) {
        res.redirect('signup');
    }
    res.render("newConnection", { req: req })
});

// routes to the logout page and reset session data
router.get(['/logout', '/logout.ejs'], function (req, res) {
    if (req.session.userProfileConnections != undefined) {
        req.session.userProfileConnections = undefined;
    }
    req.session.destroy();
    req.session = undefined;
    res.redirect("logout");
});


module.exports = router;