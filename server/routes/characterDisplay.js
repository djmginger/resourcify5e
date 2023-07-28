var express = require('express');
var router = express.Router();
const User = require('../schema');
const { authenticateJWT } = require('../cookieHandler/jwtVerifier');

router.get('/', authenticateJWT, async function (req, res) {
    try {
        const email = req.user.email; // Access the email from the cookie provided by authenticateJWT
        const characterName = req.query.characterName;

        const user = await User.findOne({ email: email });

        if (!user) {
            // User with the given email not found
            return res.status(404).json({ error: 'User not found' });
        }

        const character = user.characters.find(character => character.characterName === characterName);
        const settings = user.settings;

        if (!character) {
            // Character with the given name not found for the user
            return res.status(404).json({ error: 'Character not found' });
        }

        return res.status(200).json({ character, settings });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error occurred' });
    }
});

router.post('/', authenticateJWT, async function (req, res) {
    console.log("recieved post request")
    try {
        const email = req.user.email; // Access the email from the cookie provided by authenticateJWT
        const { character } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            // User with the given email not found
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the character by name within the user's characters array
        const foundCharacter = user.characters.find(
            (char) => char.characterName === character.characterName
        );

        if (!foundCharacter) {
            // Character with the given name not found for the user
            return res.status(404).json({ error: 'Character not found' });
        }

        // Update the character properties with the data from the request
        foundCharacter.classes = character.classes;
        foundCharacter.stats = character.stats;
        foundCharacter.resources = character.resources;
        foundCharacter.spellpoints = character.spellpoints;

        // Save the updated user object
        await user.save();
        return res.status(200).json({ message: 'Character updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error occurred' });
    }
});

module.exports = router;