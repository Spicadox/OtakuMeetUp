class Connection {
    constructor(id, title, category, details, dateTime, location) {
        this._id = id;
        this._title = title;
        this._category = category;
        this._details = details;
        this._dateTime = dateTime;
        this._location = location;
    }

    getID() {
        return this._id;
    }

    setID(value) {
        this._id = value;
    }

    getTitle() {
        return this._title;
    }

    setTitle(value) {
        this._title = value;
    }

    getCategory() {
        return this._category;
    }

    setCategory(value) {
        this._category = value;
    }

    getDetails() {
        return this._details;
    }

    setDetails(value) {
        this._details = value;
    }

    getDateTime() {
        return this._dateTime;
    }

    setDateTime(value) {
        this._dateTime = value;
    }

    getLocation() {
        return this._location;
    }

    setLocation(value) {
        this._location = value;
    }

}

module.exports = Connection;