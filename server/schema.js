const mongoose = require('mongoose');
var bcrypt = require('bcrypt');

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

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        characters: [characterSchema], // Nested array of characters
    },
    {versionKey: false}
);

// hash password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// validate password is correct
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;