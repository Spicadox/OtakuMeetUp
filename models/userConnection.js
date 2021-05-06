class UserConnection {
    constructor(connection, rsvp) {
        this.connection = connection;
        this.rsvp = rsvp;
    }

    getConnection() {
        return this.connection;
    }

    setConnection(value) {
        this.connection = value;
    }

    getRsvp() {
        return this.rsvp;
    }

    setRsvp(value) {
        this.rsvp = value;
    }
}

module.exports = UserConnection;