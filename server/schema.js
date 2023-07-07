const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    characterName: String,
    classes: [
        {
            className: String,
            classLevel: Number,
            subclass: String,
        },
    ],
    resources: [
        {
            resourceName: String,
            resourceMax: Number,
            resourceCurrent: Number,
        },
    ],
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    characters: [characterSchema], // Nested array of characters
});

const User = mongoose.model('User', userSchema);

module.exports = User;