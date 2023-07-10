const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    characterName: String,
    classes: [
        {
            _id: false,
            className: String,
            classLevel: Number,
            subclass: String,
        },
    ],
    resources: [
        {
            _id: false,
            resourceName: String,
            resourceMax: Number,
            resourceCurrent: Number,
            resetOnLong: Boolean,
            restOnShort: Boolean,
        },
    ],
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    characters: [characterSchema], // Nested array of characters
});

const User = mongoose.model('User', userSchema);

module.exports = User;