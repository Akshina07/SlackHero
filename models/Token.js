const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const TokenSchema = new Schema({
    app_id: {
        type: String,
        required: true
    },
    authed_user_id: String,
    
    scope: {
        type: Array
    },
    token_type: String,
    acess_token: String,
    bot_user_id: String,
    team: {
        id: String,
        name: String
    },
    incoming_webhook: {
        channel: String,
        channel_d: String,
        configuration_url : String,
        url : String
    }
});

module.exports = Token = mongoose.model('token', TokenSchema);
