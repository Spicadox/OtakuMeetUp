const Connection = require('../models/connection');

// hard coded connections
// currently missing host, pfp, and time
const connections = [
    new Connection('am0221', 'Mushoku Tensei', 'Anime',
        'An online meetup via Zoom to watch and discuss the latest episode of Mushoku Tensei.',
        '02-21-2021', 'Online Zoom Call'),
    new Connection('om0221', 'One Piece', 'Anime',
        'An online meetup via Zoom to watch and discuss the latest episode of One Piece.',
        '02-21-2021', 'Online Zoom Call'),
    new Connection('ab0221', 'Black Clover', 'Anime',
        'An online meetup via Zoom to watch and discuss the latest episode of Black Clover.',
        '02-21-2021', 'Online Zoom Call'),
    new Connection('as0221', 'Shingeki no Kyojin The Final Season', 'Anime',
        'An online meetup via Zoom to watch and discuss the latest episode of Shingeki no Kyojin The Final Season.',
        '02-21-2021', 'Online Zoom Call'),
    new Connection('aj0221', 'Jujutsu Kaisen', 'Anime',
        'An online meetup via Zoom to watch and discuss the latest episode of Jujutsu Kaisen.',
        '02-21-2021', 'Online Zoom Call'),

    new Connection('ms0221', 'Spy x Family', 'Manga',
        'An online meetup via Zoom to watch and discuss the latest episode of Spy x Family.',
        '02-22-2021', 'Online Zoom Call'),
    new Connection('mo0221', 'One Piece', 'Manga',
        'An online meetup via Zoom to watch and discuss the latest episode of One Piece.',
        '02-21-2021', 'Online Zoom Call'),
    new Connection('mc0221', 'Chainsaw Man', 'Manga',
        'An online meetup via Zoom to watch and discuss the latest episode of Chainsaw Man.',
        '02-21-2021', 'Online Zoom Call'),
    new Connection('mb0221', 'Boku no Hero Academia', 'Manga',
        'An online meetup via Zoom to watch and discuss the latest episode of Boku no Hero Academia.',
        '02-21-2021', 'Online Zoom Call'),


    new Connection('gy0221', 'Yakuza 0', 'Game',
        'An online meetup via Zoom to watch and discuss the latest episode of Yakuza 0.',
        '02-21-2021', 'Online Zoom Call'),
    new Connection('gf0221', 'Final Fantasy XIV', 'Game',
        'An online meetup via Zoom to watch and discuss the latest episode of Final Fantasy XIV.',
        '02-21-2021', 'Online Zoom Call'),
    new Connection('gn0221', 'Nier Automata', 'Game',
        'An online meetup via Zoom to watch and discuss the latest episode of Nier Automata.',
        '02-21-2021', 'Online Zoom Call'),
    new Connection('gb0221', 'BlazBlue Centralfiction', 'Game',
        'An online meetup via Zoom to watch and discuss the latest episode of BlazBlue Centralfiction.',
        '02-21-2021', 'Online Zoom Call'),
];

class ConnectionDB {
    // method that takes in a connection's id as an argument and return the specific connection object in the connections' list
    getConnection(connectionID) {
        for (let i = 0; i < connections.length; i++) {
            if (connections[i].id === connectionID) {
                return connections[i]
            }
        }
    }

    //method that returns all the hardcoded connections' list
    getConnections() {
        return connections;
    }
}

module.exports = ConnectionDB