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
    stats: {
        str: Number,
        dex: Number,
        con: Number,
        int: Number,
        wis: Number,
        cha: Number,
    },
    resources: [
        {
            _id: false,
            resourceName: String,
            resourceMax: Number,
            resourceCurrent: Number,
            resetOnLong: Boolean,
            resetOnShort: Boolean,
            extras: mongoose.Schema.Types.Mixed,
        },
    ],
    spellpoints: {
        current: Number,
        max: Number,
        powerSpells: {
            "6th Level Spells": Boolean,
            "7th Level Spells": Boolean,
            "8th Level Spells": Boolean,
            "9th Level Spells": Boolean,
        }
    },
    settings: {
        showSpellpoints: {
            type: Boolean,
            default: false
        },
        showMaxValues: {
            type: Boolean,
            default: true
        }
    }
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
        userTheme: {
            type: String,
            default: "dark"
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