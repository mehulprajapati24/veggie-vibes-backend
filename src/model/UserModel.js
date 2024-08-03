const mongoose = require("mongoose");
const {Schema} = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
        },
    isLocked: {
        type: Boolean,
        default: false // Default to unlocked
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User