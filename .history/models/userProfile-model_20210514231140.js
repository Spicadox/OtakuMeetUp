const mongoose = require('mongoose');
const User = require('./user-model');
const UserConnection = require('./userConnection-model');
const Connection = require('./connection-model');
// const { options } = require('../controllers/userController');
const Schema = mongoose.Schema;
// mongoose.set('useFindAndModify', false);
// mongoose.set('returnOriginal', false);

const userProfileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    userConnections: [{ type: Schema.Types.ObjectId, ref: 'userConnection', default: null }]
});
// userProfileSchema.plugin(deepPopulate);

// method that adds a specific connection to the userProfile
// takes in the user connection to add and returns the promise
userProfileSchema.methods.addConnection = function (userConnection) {
    let id = this._id;
    return new Promise(function (resolve, reject) {
        // const filter = { _id: this._id, 'userConnections.connection': userConnection };
        // const update = { $set: { 'userConnections.rsvp': userConnection.rsvp }, $push: { 'userConnections': userConnection } };

        // finds the user's userprofile based on the id
        UserProfile.findOne({ _id: id }, 'userConnections', { new: true })
            .populate({ path: 'userConnections', model: 'userConnection', populate: { path: 'connection', model: 'connection' } }).exec(function (err, updatedUserProfile) {
                // iterate through all the userConnections in the user profile
                for (let i = 0; i < updatedUserProfile.userConnections.length; i++) {
                    // updates rsvp if connection title and category matches that from the new user coconnection
                    if (updatedUserProfile.userConnections[i].connection.title == userConnection.connection.title && updatedUserProfile.userConnections[i].connection.category == userConnection.connection.category) {
                        if (updatedUserProfile.userConnections[i].rsvp != userConnection.connection.rsvp) {
                            updatedUserProfile.userConnections[i].rsvp = userConnection.rsvp;
                            updatedUserProfile.userConnections[i].save((err) => reject(err));
                            return resolve();
                        }
                        else {
                            return reject();
                        }
                    }
                    // push the userconnection into the array of user connections if the iteration reaches the end and there are no connection match
                    else if (i == updatedUserProfile.userConnections.length - 1) {
                        updatedUserProfile.userConnections.push(userConnection);
                        updatedUserProfile.save();
                        return resolve();
                    }
                }
                // push the userconnection into the array of user connections if there are no userconnections
                if (updatedUserProfile.userConnections.length == 0) {
                    updatedUserProfile.userConnections.push(userConnection);
                    updatedUserProfile.save();
                    return resolve();
                }

            })

    })
}

// method that takes in a connection ID and removes it from the userConnections array
userProfileSchema.methods.removeConnection = function (deleteID) {
    let userProfileId = this._id;
    return new Promise(function (resolve, reject) {

        // const filter = { _id: this._id, 'userConnections.connection': userConnection };
        // const update = { $set: { 'userConnections.rsvp': userConnection.rsvp }, $push: { 'userConnections': userConnection } };

        // find the userProfile and populate the references
        UserProfile.findOne({ _id: userProfileId }, 'userConnections', { new: true })
            .populate({ path: 'userConnections', model: 'userConnection', populate: { path: 'connection', model: 'connection' } }).exec(function (err, updatedUserProfile) {
                //iterates through all the userconnections to find the connection to delete
                for (let i = 0; i < updatedUserProfile.userConnections.length; i++) {
                    //if the deleteID matches a connection id in the array then remove it
                    if (updatedUserProfile.userConnections[i].connection._id == deleteID) {
                        let userConnectionID = updatedUserProfile.userConnections[i]._id;
                        updatedUserProfile.userConnections.splice(i, 1);
                        UserConnection.deleteOne({ _id: userConnectionID });
                        updatedUserProfile.save();
                        return resolve();
                    }
                    //fail safe to reject the promise if there are no connection match(should never come to this though)
                    else if (i == updatedUserProfile.userConnections.length - 1) {
                        return reject();
                    }
                }
            })
    })
}

//method that updates the connection rsvp by taking in the connection ID and new rsvp
userProfileSchema.methods.updateRSVP = function (updateID, rsvp) {
    let userProfileId = this._id;
    return new Promise(function (resolve, reject) {

        // const filter = { _id: this._id, 'userConnections.connection': userConnection };
        // const update = { $set: { 'userConnections.rsvp': userConnection.rsvp }, $push: { 'userConnections': userConnection } };

        // find the userProfile and populate the references
        UserProfile.findOne({ _id: userProfileId }, 'userConnections', { new: true })
            .populate({ path: 'userConnections', model: 'userConnection', populate: { path: 'connection', model: 'connection' } }).exec(function (err, updatedUserProfile) {
                //iterates through the userconnections
                for (let i = 0; i < updatedUserProfile.userConnections.length; i++) {
                    //if the connection id matches updateID 
                    if (updatedUserProfile.userConnections[i].connection._id == updateID) {
                        //if rsvp doesn't match new rsvp then set new rsvp
                        if (updatedUserProfile.userConnections[i].rsvp != rsvp) {
                            updatedUserProfile.userConnections[i].rsvp = rsvp;
                            updatedUserProfile.userConnections[i].save((err) => reject(err));
                            return resolve();
                        }
                        else {
                            return reject();
                        }
                    }

                }
            })

    })
}

//method that gets all the connections from the array of user connections
userProfileSchema.methods.getConnections = async function () {
    let profileId = this._id;
    return new Promise(function (resolve, reject) {
        //finds the userprofile and populates it
        UserProfile.findOne({ _id: profileId }).populate({ path: 'userConnections', model: 'userConnection', populate: { path: 'connection', model: 'connection' } }).exec(function (err, populatedUserProfile) {
            //if the userprofile exist and is not null then return the array of userConnections
            if (populatedUserProfile != null) {
                return resolve(populatedUserProfile.userConnections);
            }
            else {
                return reject();
            }
        })
    })
}

const UserProfile = mongoose.model('userProfile', userProfileSchema);

module.exports = UserProfile;