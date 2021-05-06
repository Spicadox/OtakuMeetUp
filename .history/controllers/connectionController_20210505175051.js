const express = require('express');
const connectionDB = require('../utils/connectionDB');
const Connection = require('../models/connection-model');

const router = express.Router();


// Hard Coded Connections
let connections = [
    {
        title: 'Mushoku Tensei',
        category: 'Anime',
        details: 'An online meetup via Zoom to watch and discuss the latest episode of Mushoku Tensei.',
        dateTime: '02-21-2021',
        location: 'Online Zoom Call'
    },
    {
        title: 'One Piece',
        category: 'Anime',
        details: 'An online meetup via Zoom to watch and discuss the latest episode of One Piece.',
        dateTime: '02-21-2021',
        location: 'Online Zoom Call'
    },

    {
        title: 'Black Clover',
        category: 'Anime',
        details: 'An online meetup via Zoom to watch and discuss the latest episode of Black Clover.',
        dateTime: '02-21-2021',
        location: 'Online Zoom Call'
    },


    {
        title: 'Spy x Family',
        category: 'Manga',
        details: 'An online meetup via Zoom to watch and discuss the latest episode of Spy x Family.',
        dateTime: '02-22-2021',
        location: 'Online Zoom Call'
    },

    {
        title: 'Chainsaw Man',
        category: 'Manga',
        details: 'An online meetup via Zoom to watch and discuss the latest episode of Chainsaw Man.',
        dateTime: '02-21-2021',
        location: 'Online Zoom Call'
    },

    {
        title: 'Boku no Hero Academia',
        category: 'Manga',
        details: 'An online meetup via Zoom to watch and discuss the latest episode of Boku no Hero Academia.',
        dateTime: '02-21-2021',
        location: 'Online Zoom Call'
    },


    {
        title: 'Yakuza 0',
        category: 'Game',
        details: 'An online meetup via Zoom to watch and discuss the latest episode of Yakuza 0.',
        dateTime: '02-21-2021',
        location: 'Online Zoom Call'
    },

    {
        title: 'Final Fantasy XIV',
        category: 'Game',
        details: 'An online meetup via Zoom to watch and discuss the latest episode of Final Fantasy XIV.',
        dateTime: '02-21-2021',
        location: 'Online Zoom Call'
    },

    {
        title: 'Nier Automata',
        category: 'Game',
        details: 'An online meetup via Zoom to watch and discuss the latest episode of BlazBlue Centralfiction.',
        dateTime: '02-21-2021',
        location: 'Online Zoom Call'
    }
];
// Save all those hard coded connections
for (let i = 0; i < connections.length; i++) {
    Connection.find(connections[i]).then((result) => {
        // if connections database doesn't contain the hardcoded connections already
        if (result.length === 0) {
            new Connection(connections[i]).save();
            console.log("saved")
        }
    });
}
router.get('/', function (req, res) {
    Connection.find({})
        .then((connections) => {
            req.session.previousPath = "/connection";
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
                        if (req.query.id == connections[i]._id) {
                            req.query.id = connections[i]._id
                            res.render('connection', { connection: connections[i], req: req });
                        }
                    }
                }
            }
        })

});



module.exports = router