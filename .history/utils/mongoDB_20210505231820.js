var mongoose = require('mongoose');
const Connection = require('../models/connection-model');
const User = require('../models/user-model');
const UserProfile = require('../models/userProfile-model');
const UserConnection = require('../models/userConnection-model')

const db = 'mongodb://localhost/meetupdb';
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const mongodb = mongoose.connection;

mongodb.on('error', console.error.bind(console, 'connection error:'));
mongodb.once('open', () => console.log('Database connected successfully!'));

function addHardCodedConnections() {

}


// Save hardcoded user and userprofile
async function setUpUser() {
    let hardCodedUser = new User({ fName: 'test', lName: 'test', email: 'test', password: 'test' });
    let queryUser = await User.findOne({ email: hardCodedUser.email }).then((queryResult) => {
        console.log(queryResult);
        if (queryResult == undefined || queryResult == null) {
            hardCodedUser.save();
            let hardCodedUserProfile = new UserProfile({ user: hardCodedUser, userConnections: new UserConnection() });
            hardCodedUserProfile.save();
        }
    });
}
// setUpUser();
console.log('Finished setting up test user');
console.log('Email: test');
console.log('Password: test');

module.exports = mongodb;