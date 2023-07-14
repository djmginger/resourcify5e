var express = require('express');
var router = express.Router();
const User = require('../schema');
const { getClasses, getSubclasses } = require('../resourceObjects');

router.get('/', async function (req, res) {
    try {
        const email = req.query.email; // Access the email as a query parameter

        const user = await User.findOne({email: email});

        if (user) {
            const characterArray = user.characters; // Access the characters array
            //console.log(characterArray);
            return res.json(characterArray);
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error occurred' });
    }
});

router.post('/', async function (req, res) {
    //save new character information to user
    try {
        const email = req.body.email;
        const characterName = req.body.character.name;
        const className = req.body.character.className;
        const classLevel = req.body.character.classLevel;
        const subclass = req.body.character.subclass;
        const stats = req.body.character.stats;

        const classes = getClasses(classLevel, stats);
        const subclasses = getSubclasses(classLevel, stats);

        const user = await User.findOne({email: email});

        if (user) {
            // Check if a character with the same name already exists
            const characterExists = user.characters.some(
                (character) => character.characterName === characterName
            );

            if (characterExists) {
                return res.status(409).json({ error: 'Character name already exists' });
            } else {
                //Create an array of resources, then use the resourceObjects file to determine what resource values to add to it.
                const resourceArray = [];

                const classResources = classes[className][classLevel];
                if (classResources) {
                    resourceArray.push(...classResources);
                }

                if (subclass) {
                    const subclassResources = subclasses[className][subclass][classLevel];
                    if (subclassResources) {
                        resourceArray.push(...subclassResources);
                    }
                }

                const newCharacter = {
                    characterName: characterName,
                    classes: [
                        {
                            className: className,
                            classLevel: classLevel,
                            subclass: subclass,
                        },
                    ],
                    stats: stats,
                    resources: resourceArray,
                }

                user.characters.push(newCharacter)
                await user.save();
                return res.status(200).json({ message: 'Character added successfully' });
            }
        }
    } catch (err) {
        console.log("Error occurred", err);
        return res.status(500).send('Error occurred');
    }
});

module.exports = router;