const express = require('express');
const connectionDB = require('../utils/connectionDB');
const Connection = require('../models/connection-model');

const router = express.Router();

router.get('/', function (req, res) {
    //
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