const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

// Create Schema for Users
const RoomSchema = new Schema({
    
    name: {
        type: String,
        required: true,
    },
    slack_channel: String,
    members: {
        type: []
    }
});

module.exports = Room = mongoose.model('room',RoomSchema);
