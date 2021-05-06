const mongoose = require('mongoose');
const User = require('./user-model');
const UserConnection = require('./userConnection-model');
const Connection = require('./connection-model');
const { options } = require('../controllers/userController');
// var deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);
mongoose.set('returnOriginal', false);

const userProfileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    userConnections: [{ type: Schema.Types.ObjectId, ref: 'userConnection', default: null }]
});
// userProfileSchema.plugin(deepPopulate);

userProfileSchema.methods.addConnection = function (newUserProfile, userConnection) {
    // let id = this._id;
    console.log("ADDING CONNECTION")
    console.log(this.userConnections._id);
    console.log(this)
    return new Promise(function (resolve, reject,) {
        console.log(this._id)

        // UserProfile.findOneAndUpdate({ _id: this._id }, { $set: { userConnections: userConnection }, $setOnInsert: { user: newUserProfile.user, _id: newUserProfile._id } }, { upsert: true, new: true })
        //     .populate({ path: 'userConnections', model: 'userConnection' }).exec(function (err, updatedUserProfile) {
        //         console.log("FIND AND UPDATE");
        //         console.log(updatedUserProfile)
        //         if (updatedUserProfile != null) {
        //             return resolve("SUCCESS");
        //         }
        //         else {
        //             return reject("FAILURE");
        //         }
        //     })
        // console.log("PROFILE ID")
        // console.log(newUserProfile._id)
        // console.log(mongoose.Types.ObjectId(newUserProfile._id))
        // UserProfile.findOne({ _id: this._id }, 'userConnections').populate({ path: 'userConnections', model: 'userConnection' }).then(function (userConnections) {
        //     console.log("USER CONNECTIONS")
        //     console.log(userConnections)
        //     userConnections.findOneAndUpdate({ 'userConnections.connection': userConnection.connection }, { $set: { 'userConnections.rsvp': userConnection.rsvp }, $push: { 'userConnections': userConnection } }, { new: true })
        //         .populate({ path: 'userConnections', model: 'userConnection' }).exec(function (err, updatedUserConnections) {
        //             console.log("UPDATEDUSERCONNECTIONS");
        //             console.log(updatedUserConnections)
        //         })
        // });



        // const filter = { _id: this._id, 'userConnections.connection': userConnection };
        // const update = { $set: { 'userConnections.rsvp': userConnection.rsvp }, $push: { 'userConnections': userConnection } };
        // UserProfile.findOneAndUpdate({ _id: newUserProfile._id }, update, { new: true })
        //     .populate({ path: 'userConnections', model: 'userConnection' }).exec(function (err, updatedUserProfile) {
        //         console.log("FIND AND UPDATE");
        //         console.log(updatedUserProfile)

        //         if (updatedUserProfile == null) {
        //             UserProfile.findOne({ _id: this._id }).populate({ path: 'userConnections', model: 'userConnection' }).exec(function (err, userProfile) {
        //                 userProfile.userConnections.push(userConnection);
        //                 console.log("PUSHED CONNECTION")
        //                 console.log(userProfile.userConnections)
        //                 userProfile.save(function (err) {
        //                     if (err) {
        //                         console.log(err);
        //                     }
        //                 })
        //             })
        //         }

        //         if (updatedUserProfile != null) {
        //             return resolve("SUCCESS");
        //         }
        //         else {
        //             return reject("FAILURE");
        //         }
        //     })





        const filter = { _id: this._id, 'userConnections.connection': userConnection };
        const update = { $set: { 'userConnections.rsvp': userConnection.rsvp }, $push: { 'userConnections': userConnection } };
        UserProfile.findOne({ _id: this._id }, 'userConnections', { new: true })
            .populate({ path: 'userConnections', model: 'userConnection' }).exec(function (err, updatedUserProfile) {
                console.log("HERE")]
                
                for (let i = 0; i < updatedUserProfile.length; i++) {
                    if (updatedUserProfile[i].connection.title == userConnection.connection.title && updatedUserProfile[i].connection.category == userConnection.connection.category) {
                        if (updatedUserProfile[i].rsvp != userConnection.connection.rsvp) {
                            updatedUserProfile[i].rsvp = userConnection.connection.rsvp;
                            updatedUserProfile.save();
                            console.log("LOOP: UPDATED RSVP")
                            return resolve();
                        }
                        else {
                            console.log("LOOP REJECTED")
                            return reject();
                        }
                    }
                    else {
                        updatedUserProfile.push(userConnection);
                        updatedUserProfile.save();
                        console.log("LOOP PUSHED CONNECTION")
                        return resolve();
                    }
                }

            })

    })








    // UserProfile.findOne({ _id: this._id }).populate({ path: 'userConnections', model: 'userConnection' }).exec(function (err, result) {
    //     console.log("RESULT");
    //     console.log(result);
    //     if (result.userConnections.length != 0) {
    //         UserProfile.findOneAndUpdate({ _id: this._id }, { userConnections: userConnection }).populate({ path: 'userConnections', model: 'userConnection' }).exec(function (err, updated) {
    //             console.log("FIND AND UPDATE");
    //             console.log(updated)
    //             if (updated == null) {
    //                 result.userConnections.push(userConnection).save();
    //             }
    //         })
    //     }
    //     else {
    //         result.userConnections.push(userConnection).save();
    //     }
    // })









    // for (let i = 0; i < this.userConnections.length; i++) {
    //     UserConnection.find({}).populate({ path: 'userConnections', model: 'connection' }).exec((result) => console.log(result))
    //     console.log(userConnection._id);
    //     if (this.userConnections[i] == userConnection._id) {
    //         if (this.userConnections[i].rsvp != userConnection.rsvp) {
    //             this.userConnections[i].rsvp = userConnection.rsvp;
    //             console.log("UPDATED RSVP")
    //             return new Promise((resolve) => resolve("SUCCESS"));
    //         }
    //     }
    //     else if (i == this.userConnections.length - 1 && this.userConnections[i] != userConnection._id) {
    //         this.userConnections.push(userConnection);
    //         new UserConnection({ user: userConnection.user, userConnection: userConnection.userConnections }).save();
    //         console.log("ADDED NEW CONNECTION")
    //         return new Promise((resolve) => resolve("SUCCESS"));
    //     }
    //     else {
    //         return new Promise((reject) => reject("SUCCESS"));
    //     }
    // }












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












    // console.log(this)
    // return new Promise(function (resolve, reject) {
    //     // find and update with new connection
    //     this.findOneAndUpdate({ userConnections: userConnection }).populate({ path: 'userConnections', model: 'connection' }).exec((result, err) => {
    //         if (err) {
    //             reject(err);
    //         }
    //         console.log("UPDATED");
    //         console.log(result);
    //         // save new connection
    //         // catch error
    //         try {
    //             if (result.userConnections.length == 0) {
    //                 console.log("SAVED NEW")
    //                 console.log(result.connection);
    //                 console.log(userConnection.rsvp);
    //                 new UserConnection({ connection: result.connection, rsvp: userConnection.rsvp }).save();
    //             }
    //         }
    //         catch (err) {
    //             if (result == null) {
    //                 console.log("FOUND NULL")
    //                 UserProfile.userConnections.push(UserConnection({ connection: userConnection.connection, rsvp: userConnection.rsvp }).save());
    //                 resolve("Sucessfully Added");
    //             }
    //             reject(err);
    //         }
    //         resolve("Sucessfully Added");
    //     })

    // })





    // if (this.userConnections.length > 0) {
    //     for (let i = 0; i < this.userConnections.length; i++) {
    //         if (userConnection._id === this.userConnections[i].connection._id) {
    //             if (rsvp != this.userConnections[i].rsvp) {
    //                 this.userConnections[i].rsvp = rsvp;
    //             }
    //             break;
    //         }
    //         else if (i == (this.userConnections.length - 1)) {
    //             this.userConnections.push(new UserConnection(userConnection, rsvp));
    //             break;
    //         }
    //     }
    // }
    // else {
    //     this.userConnections.push(new UserConnection(userConnection, rsvp));
    // }
}

userProfileSchema.methods.removeConnection = connectionID => {
    for (let i = 0; i < this.userConnections.length; i++) {
        if (connectionID === this.userConnections[i].connection._id) {
            this.userConnections.splice(i, 1);
        }
    }
}

userProfileSchema.methods.updateRSVP = (connectionID, rsvp) => {
    for (let i = 0; i < this.userConnections.length; i++) {
        if (connectionID === this.userConnections[i].connection._id) {
            this.userConnections[i].rsvp = rsvp;
        }
    }
}

userProfileSchema.methods.getConnections = async function () {
    return new Promise(function (resolve, reject) {
        UserProfile.findOne({ _id: this._id }).populate({ path: 'userConnections', model: 'userConnection', populate: { path: 'connection', model: 'connection' } }).exec(function (err, populatedUserProfile) {
            console.log("POPULATEDUSERPROFILE");
            console.log(populatedUserProfile);
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



    //     UserProfile.find({}, 'userConnections')
    //         .then((connections, err) => {
    //             let connectionsArr = [];
    //             console.log(connections)
    //             for (let i = 0; i < connections.length; i++) {
    //                 UserConnection.findOne({ _id: connections[i].userConnections[0] })
    //                     .then((connection) => {
    //                         console.log(connection);
    //                         connectionsArr.push(connection);
    //                         console.log("Added connection to array");
    //                     })
    //             }
    //             console.log("Collection array")
    //             resolve("Got Connections")
    //             return connectionsArr;
    //         })
    //         .catch((err) => reject(err));
    // })

}

const UserProfile = mongoose.model('userProfile', userProfileSchema);

module.exports = UserProfile;