let UserConnection = require('./userConnection');
let User = require('./user');
class UserProfile {

    // constructor that takes in the user object and list of userConnections
    constructor(user, userConnections) {
        this.user = user;
        this.userConnections = userConnections;
    }

    // method to return 
    getUser() {
        return this.userID;
    }

    setUser(value) {
        this.user = value;
    }

    addConnection(userConnection, rsvp) {
        if (this.userConnections.length > 0) {
            for (let i = 0; i < this.userConnections.length; i++) {
                if (userConnection._id === this.userConnections[i].connection._id) {
                    if (rsvp != this.userConnections[i].rsvp) {
                        this.userConnections[i].rsvp = rsvp;
                    }
                    break;
                }
                else if (i == (this.userConnections.length - 1)) {
                    this.userConnections.push(new UserConnection(userConnection, rsvp));
                    break;
                }
            }
        }
        else {
            this.userConnections.push(new UserConnection(userConnection, rsvp));
        }
    }

    removeConnection(connectionID) {
        for (let i = 0; i < this.userConnections.length; i++) {
            if (connectionID === this.userConnections[i].connection._id) {
                this.userConnections.splice(i, 1);
            }
        }
    }

    updateRSVP(connectionID, rsvp) {
        for (let i = 0; i < this.userConnections.length; i++) {
            console.log(connectionID);
            console.log(this.userConnections[i].connection._id);
            if (connectionID === this.userConnections[i].connection._id) {
                this.userConnections[i].rsvp = rsvp;
                console.log("updated");
            }
        }
    }

    getUserConnections() {
        return this.userConnections[0];
    }
}

module.exports = UserProfile;