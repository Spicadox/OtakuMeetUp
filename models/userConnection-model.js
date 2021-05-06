const mongoose = require('mongoose');
const Connection = require('./connection-model');

const Schema = mongoose.Schema;

const userConnectionSchema = new Schema({
    connection: { type: Schema.Types.ObjectId, ref: 'connection', default: null },
    rsvp: { type: String, default: null }
});

userConnectionSchema.methods.getConnection = () => this.connection;

userConnectionSchema.methods.setConnection = connection => this.connection = connection;

userConnectionSchema.methods.getRsvp = () => this.rsvp;

userConnectionSchema.methods.setRsvp = rsvp => this.rsvp = rsvp;


const UserConnection = mongoose.model('userConnection', userConnectionSchema);

module.exports = UserConnection;