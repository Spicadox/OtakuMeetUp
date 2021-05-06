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

userProfileSchema.methods.addConnection = function (userConnection) {
    let id = this._id;
    return new Promise(function (resolve, reject,) {
        // const filter = { _id: this._id, 'userConnections.connection': userConnection };
        // const update = { $set: { 'userConnections.rsvp': userConnection.rsvp }, $push: { 'userConnections': userConnection } };
        UserProfile.findOne({ _id: id }, 'userConnections', { new: true })
            .populate({ path: 'userConnections', model: 'userConnection', populate: { path: 'connection', model: 'connection' } }).exec(function (err, updatedUserProfile) {
                for (let i = 0; i < updatedUserProfile.userConnections.length; i++) {
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
                    else if (i == updatedUserProfile.userConnections.length - 1) {
                        updatedUserProfile.userConnections.push(userConnection);
                        updatedUserProfile.save();
                        return resolve();
                    }
                }
                if (updatedUserProfile.userConnections.length == 0) {
                    updatedUserProfile.userConnections.push(userConnection);
                    updatedUserProfile.save();
                    return resolve();
                }

            })

    })
}

userProfileSchema.methods.removeConnection = function (deleteID) {
    let userProfileId = this._id;
    return new Promise(function (resolve, reject,) {

        // const filter = { _id: this._id, 'userConnections.connection': userConnection };
        // const update = { $set: { 'userConnections.rsvp': userConnection.rsvp }, $push: { 'userConnections': userConnection } };
        UserProfile.findOne({ _id: userProfileId }, 'userConnections', { new: true })
            .populate({ path: 'userConnections', model: 'userConnection', populate: { path: 'connection', model: 'connection' } }).exec(function (err, updatedUserProfile) {
                for (let i = 0; i < updatedUserProfile.userConnections.length; i++) {
                    if (updatedUserProfile.userConnections[i].connection._id == deleteID) {
                        let userConnectionID = updatedUserProfile.userConnections[i]._id;
                        updatedUserProfile.userConnections.splice(i, 1);
                        UserConnection.deleteOne({ _id: userConnectionID });
                        updatedUserProfile.save();
                        return resolve();
                    }
                    else if (i == updatedUserProfile.userConnections.length - 1) {
                        return reject();
                    }
                }
            })
    })
}

userProfileSchema.methods.updateRSVP = function (updateID, rsvp) {
    let userProfileId = this._id;
    return new Promise(function (resolve, reject,) {

        // const filter = { _id: this._id, 'userConnections.connection': userConnection };
        // const update = { $set: { 'userConnections.rsvp': userConnection.rsvp }, $push: { 'userConnections': userConnection } };
        UserProfile.findOne({ _id: userProfileId }, 'userConnections', { new: true })
            .populate({ path: 'userConnections', model: 'userConnection', populate: { path: 'connection', model: 'connection' } }).exec(function (err, updatedUserProfile) {
                console.log("BEFORE FOR LOOP");
                console.log(rsvp);
                for (let i = 0; i < updatedUserProfile.userConnections.length; i++) {
                    console.log("1");
                    if (updatedUserProfile.userConnections[i].connection._id == updateID) {
                        console.log("INSIDE CHECKING ID")
                        if (updatedUserProfile.userConnections[i].rsvp != rsvp) {

                            updatedUserProfile.userConnections[i].rsvp = rsvp;
                            console.log(updatedUserProfile.userConnections[i].rsvp)
                            console.log(rsvp);
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

userProfileSchema.methods.getConnections = async function () {
    let profileId = this._id;
    console.log(profileId);
    return new Promise(function (resolve, reject) {
        UserProfile.findOne({ _id: profileId }).populate({ path: 'userConnections', model: 'userConnection', populate: { path: 'connection', model: 'connection' } }).exec(function (err, populatedUserProfile) {
            console.log(populatedUserProfile);
            if (populatedUserProfile != null) {
                return resolve(populatedUserProfile.userConnections);
            }
            else {
                return reject("REJECT");
            }
        })
    })
}

const UserProfile = mongoose.model('userProfile', userProfileSchema);

module.exports = UserProfile;