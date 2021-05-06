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
    // let id = this._id;
    console.log("ADDING CONNECTION")
    // console.log(this.userConnections._id);
    // console.log(this)
    console.log(this._id)
    let id = this._id;
    return new Promise(function (resolve, reject,) {
        // const filter = { _id: this._id, 'userConnections.connection': userConnection };
        // const update = { $set: { 'userConnections.rsvp': userConnection.rsvp }, $push: { 'userConnections': userConnection } };
        UserProfile.findOne({ _id: id }, 'userConnections', { new: true })
            .populate({ path: 'userConnections', model: 'userConnection', populate: { path: 'connection', model: 'connection' } }).exec(function (err, updatedUserProfile) {
                console.log("HERE")
                console.log(updatedUserProfile);
                console.log(updatedUserProfile.userConnections.length)
                console.log(updatedUserProfile.userConnections[0].connection)
                console.log("USERCONNECTION ERROR")
                console.log(userConnection);
                for (let i = 0; i < updatedUserProfile.userConnections.length; i++) {
                    console.log(updatedUserProfile.userConnections[i].connection.title)
                    console.log(userConnection.connection.title)
                    console.log(updatedUserProfile.userConnections[i].connection.category)
                    console.log(userConnection.connection.category)
                    console.log(i == updatedUserProfile.userConnections.length - 1);
                    if (updatedUserProfile.userConnections[i].connection.title == userConnection.connection.title && updatedUserProfile.userConnections[i].connection.category == userConnection.connection.category) {
                        if (updatedUserProfile.userConnections[i].rsvp != userConnection.connection.rsvp) {
                            // console.log(updatedUserProfile.userConnections[i])
                            updatedUserProfile.userConnections[i].rsvp = userConnection.rsvp;
                            // console.log(updatedUserProfile.userConnections[i])
                            // console.log(userConnection.rsvp)
                            updatedUserProfile.userConnections[i].save((err) => reject(err));
                            // console.log("LOOP: UPDATED RSVP")
                            return resolve();
                        }
                        else {
                            // console.log("LOOP REJECTED")
                            return reject();
                        }
                    }
                    else if (i == updatedUserProfile.userConnections.length - 1) {
                        updatedUserProfile.userConnections.push(userConnection);
                        updatedUserProfile.save();
                        // console.log("LOOP PUSHED CONNECTION")
                        return resolve();
                    }
                }
                if (updatedUserProfile.userConnections.length == 0) {
                    updatedUserProfile.userConnections.push(userConnection);
                    updatedUserProfile.save();
                    // console.log("LOOP PUSHED CONNECTION")
                    return resolve();
                }

            })

    })


    // find and update with new connection
    // this.findOneAndUpdate({ userConnections: userConnection }).populate({ path: 'userConnections', model: 'connection' }).exec((result, err) => {
    //     if (err) {
    //         reject(err);
    //     }
    //     console.log("UPDATED");
    //     console.log(result);
    //     // save new connection
    //     // catch error
    //     try {
    //         if (result.userConnections.length == 0) {
    //             console.log("SAVED NEW")
    //             console.log(result.connection);
    //             console.log(userConnection.rsvp);
    //             new UserConnection({ connection: result.connection, rsvp: userConnection.rsvp }).save();
    //         }
    //     }
    //     catch (err) {
    //         if (result == null) {
    //             console.log("FOUND NULL")
    //             UserProfile.userConnections.push(UserConnection({ connection: userConnection.connection, rsvp: userConnection.rsvp }).save());
    //             resolve("Sucessfully Added");
    //         }
    //         reject(err);
    //     }
    //     resolve("Sucessfully Added");
    // })

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
    return new Promise(function (resolve, reject) {
        UserProfile.findOne({ _id: profileId }).populate({ path: 'userConnections', model: 'userConnection', populate: { path: 'connection', model: 'connection' } }).exec(function (err, populatedUserProfile) {

            if (populatedUserProfile != null) {
                return resolve(populatedUserProfile.userConnections);
            }
            else {
                return resolve("REJECT");
            }
            // return populatedUserProfile.userConnections;
        })
    })


    // UserProfile.find({}, 'userConnections').populate({ path: 'userConnections', model: 'userConnection', populate: { path: 'connection', model: 'connection' } })
    //     .exec((err, post) => {
    //         if (err) {
    //             console.log("ERROR")
    //             console.log(err);
    //         }
    //         console.log("GET CONNECTIONS");
    //         console.log(post);
    //         console.log(post._id);
    //     });

    // console.log(this);
    // console.log("GET CONNECTIONS");
    // console.log(this)
    // console.log("THIS")
    // let ConnectionsArr = [];
    // for (let i = 0; i < this.userConnections.length; i++) {
    //     Connection.findOne({ _id: this.userConnections[i] }).then(function (result, err) {
    //         if (err) {
    //             console.log(err)
    //         }
    //         if (result != null) {
    //             ConnectionsArr.push(result);
    //             console.log("PUSHED NEW CONNECTION")
    //         }
    //     })
    // }
    // return new Promise((resolve) => resolve(ConnectionArr));
}

const UserProfile = mongoose.model('userProfile', userProfileSchema);

module.exports = UserProfile;