const mongoose = require('mongoose');
const User = require('./user-model');
const UserConnection = require('./userConnection-model');
const Connection = require('./connection-model');
// var deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

const userProfileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    userConnections: [{ type: Schema.Types.ObjectId, ref: 'userConnection', default: null }]
});
// userProfileSchema.plugin(deepPopulate);

userProfileSchema.methods.addConnection = function (userConnection) {

    for (let i = 0; i < this.userConnections.length; i++) {
        UserProfile.findOne({ _id: this._id }).populate({ path: 'userConnections', model: 'userConnection' }).exec(function (err, result) {
            console.log("RESULT");
            console.log(result);
            if (result.userConnections.length != 0) {
                UserProfile.findOneAndUpdate({ _id: this._id }, { userConnections: userConnection }).populate({ path: 'userConnections', model: 'userConnection' }).exec(function (err, updated) {
                    console.log("FIND AND UPDATE");
                    console.log(updated)
                    if(updated == null) {
                        result.userConnections.push(userConnection).save();
                    }
                })
            }
            else {
                result.userConnections.push(userConnection).save();
            }
        })
    }








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

userProfileSchema.methods.getConnections = function () {
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

    console.log(this);
    console.log("GET CONNECTIONS");
    console.log(this)
    console.log("THIS")
    let ConnectionsArr = [];
    for (let i = 0; i < this.userConnections.length; i++) {
        Connection.findOne({ _id: this.userConnections[i] }).then(function (result, err) {
            if (err) {
                console.log(err)
            }
            if (result != null) {
                ConnectionsArr.push(result);
                console.log("PUSHED NEW CONNECTION")
            }
        })
    }
    return new Promise((resolve) => resolve(ConnectionArr));



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