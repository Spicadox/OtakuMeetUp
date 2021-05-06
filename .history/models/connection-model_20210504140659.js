const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    title: { type: String, default: null },
    category: { type: String, default: null },
    details: { type: String, default: null },
    dateTime: { type: Date, default: null },
    location: { type: String, default: null }
});

const Connection = mongoose.model('connection', connectionSchema);


module.exports = Connection;