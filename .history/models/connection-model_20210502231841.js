const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    title: { type: String, default: null },
    category: { type: String, default: null },
    details: { type: String, default: null },
    dateTime: { type: Date, default: null },
    location: { type: String, default: null }
});

const Connection = mongoose.model('connection', connectionSchema);

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
for (let i = 0; i < connections.length; i++) {
    Connection.find(connections[i]).then((result) => {
        // if connections database doesn't contain the hardcoded connections already
        if (result.length === 0) {
            new Connection(connections[i]).save();
            console.log("saved")
        }
    });
}
module.exports = Connection;