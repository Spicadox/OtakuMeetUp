class User {
    constructor(uID, fName, lName, email) {
        this.uID = uID;
        this.fName = fName;
        this.lName = lName;
        this.email = email;
    }

    getUID() {
        return this.getUID;
    }

    setUID(value) {
        this.uID = value;
    }

    getFName() {
        return this.fName;
    }

    setFName(value) {
        this.fName = value;
    }

    getLName() {
        return this.lName;
    }

    setLName(value) {
        this.lName = value;
    }

    getEmail() {
        return this.email;
    }

    setEmail(value) {
        this.email = email;
    }
}

module.exports = User;