var mongoose = require('mongoose');

const db = 'mongodb://localhost/meetupdb2';
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const mongodb = mongoose.connection;

mongodb.on('error', console.error.bind(console, 'connection error:'));
mongodb.once('open', () => console.log('Database connected successfully!'));

module.exports = mongodb;