const express = require('express');
const Connection = require('../models/connection-model');
const User = require('../models/user-model');
const UserProfile = require('../models/userProfile-model');
const UserConnection = require('../models/userConnection-model')
const router = express.Router();

// Create the connectionDB object and set all the hardcoded connections to the connections variable
const connectionDB = require('../utils/connectionDB');
const Mongoose = require('mongoose');
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
                            .then((userProfile) => console.log(userProfile))
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
router.post(['/login', '/login.ejs'], function (req, res) {
    User.find({ email: req.body.email, password: req.body.password })
        .then((queryLogin) => {
            // temporary include length of > 0 instead of >= 0
            console.log(queryLogin);
            if (queryLogin.length > 0) {
                UserProfile.findOne({ user: queryLogin })
                    .then((userProfile) => {
                        req.session.user = queryLogin;
                        req.session.userProfile = userProfile;
                        res.render('savedConnections', { userProfile: req.session.userProfileConnections, req: req });
                    })
                    .catch((err) => console.log("Error getting user profile: " + err));
            }
            // sent incorrect email or passcode message
            else {
                // alert("Incorrect Email or Passcode");
                res.redirect('login');
            }
        });
    // res.render('savedConnections', { userProfile: req.session.userProfile });
});

// Post request to display all the user connections on the savedConnections page
router.post(['/savedConnections'], async function (req, res) {
    // for adding/update userconnections if the previous page is /connection
    // meaning the update button wasn't pressed on savedConnections page
    if (req.session.previousPath == "/connection") {
        if (req.session.userProfileConnections === undefined) {
            // req.session.userProfileConnections = new UserConnection([{ userConnection: new Connection() }]);
        }
        let userProfilePromise =  UserProfile.findOne({ _id: req.session.userProfile._id }).exec((userProfile) => {
            if (userProfile.length == 0) {
                let newUserProfile = new UserProfile(
                    {
                        _id: req.session.userProfile._id,
                        user: new User({
                            _id: req.session.user[0]._id,
                            fName: req.session.user[0].fName,
                            lName: req.session.user[0].lName,
                            email: req.session.user[0].email,
                            password: req.session.user[0].password
                        }), userConnections: new UserConnection([{ userConnection: new Connection() }])
                    });
                console.log("added new userProfile");
            }
            else {
                let newUserProfile = userProfile;
                console.log("using old user profile");
            }
        })

        let parsedConnection = JSON.parse(req.body.connection);
        console.log(parsedConnection);
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
        console.log("NEW USER CONNECTION")
        console.log(newUserConnection)
        // console.log("newUserProfile.userConnections");
        // console.log(newUserProfile.userConnections)
        // console.log(newUserProfile.userConnections.length)
        // await UserProfile.findOne({ _id: newUserProfile._id }).populate({ path: 'userConnections', model: 'userConnection' }).exec(function (err, result) {
        //     console.log("RESULT");
        //     console.log(result);
        //     if (result.userConnections.length == 0) {
        //         UserProfile.findOneAndUpdate({ _id: newUserProfile._id }, { userConnections: newUserConnection }).populate({ path: 'userConnections', model: 'userConnection' }).exec(function (err, result) {
        //             console.log("FIND AND UPDATE");
        //             console.log(result)
        //             UserConnection.populate('userConnections.connection', { path: 'connection', model: 'connection' }, function (temp, err) {
        //                 console.log(temp);
        //             })
        //         })
        //     }
        //     else {
        //         UserProfile.findOne({ _id: newUserProfile.id }).populate({ path: 'userConnections', model: 'userConnection' }).exec(function (err, result) {
        //             connectionID = result.userConnections[0].connection;
        //             console.log("CONNECTION ID")
        //             console.log(connectionID)
        //             Connection.findOne({ _id: connectionID }).exec(function (err, connectionResult) {
        //                 console.log(connectionResult);

        //             })
        //         })
        //     }
        // })


        console.log("NEW USER PROFILE");
        console.log(newUserProfile);
        try {
            await newUserProfile.addConnection(newUserProfile, newUserConnection);
        } catch (err) {
            console.log(err);
        }

        console.log("DONE ADDING CONNECTION");
        console.log(newUserProfile);

        try {
            req.session.userProfileConnections = await newUserProfile.getConnections();
        } catch (err) {
            console.log(err)
        }

        console.log("END")
        console.log(req.session.userProfileConnections[0].userConnections);
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
    if (req.session.userProfileConnections != undefined) {
        req.session.userProfileConnections = undefined;
    }
    req.session.destroy();
    req.session = undefined;
    res.render("logout", { req: req });
});


module.exports = router;
