var express = require('express');
var router = express.Router();
const User = require('../schema');
const { getClasses, getSubclasses } = require('../resourceObjects');

router.get('/', async function (req, res) {
    try {
        const email = req.query.email; // Access the email as a query parameter
        console.log(email)
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

router.delete('/', async function (req, res) {
    try {
        const email = req.query.email; // Access the email as a query parameter
        const characterName = req.query.characterName;

        const user = await User.findOne({ email: email });

        if (!user) {
            // User with the given email not found
            return res.status(404).json({ error: 'User not found' });
        }

        /// Filter out the character with the given name from the characters array
        user.characters = user.characters.filter(
            (char) => char.characterName !== characterName
        );

        await user.save();
        return res.status(200).json({ message: 'Character deleted successfully' });

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

                if(classes[className][classLevel]){
                    const classResources = classes[className][classLevel];
                    if (classResources) {
                        resourceArray.push(...classResources);
                    }
                } else {
                    console.log('Subclass not found or has no resources for the given class level');
                }

                if (
                    subclass &&
                    subclasses[className] &&
                    subclasses[className][subclass] &&
                    subclasses[className][subclass][classLevel]
                ) {
                    const subclassResources = subclasses[className][subclass][classLevel];
                    if (subclassResources) {
                        resourceArray.push(...subclassResources);
                    }
                } else {
                    console.log('Subclass not found or has no resources for the given class level');
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
                    spellpoints: generateSpellpoints(resourceArray)
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

const generateSpellpoints = (resourceArray) => {
    const spellPointObject = {
            current: undefined,
            max: undefined,
            powerSpells: {
                six: undefined,
                seven: undefined,
                eight: undefined,
                nine: undefined,
            }
        };

    resourceArray.forEach(resource => {
        //All normal spell slots have an extra object with a pointValue, so check if it exists. If so, then add it to the spellPointObject
        if (resource.extras && resource.extras.pointValue) {
            const resourceName = resource.resourceName;

            if (!spellPointObject.max && !spellPointObject.current){
                spellPointObject.max = resource.extras.pointValue;
                spellPointObject.current = spellPointObject.max;
            } else {
                spellPointObject.max += resource.extras.pointValue;
                spellPointObject.current = spellPointObject.max;
            }

            switch (resourceName){
                case "6th Level Spells":
                    spellPointObject.powerSpells.six = true;
                    break;
                case "7th Level Spells":
                    spellPointObject.powerSpells.seven = true;
                    break;
                case "8th Level Spells":
                    spellPointObject.powerSpells.eight = true;
                    break;
                case "9th Level Spells":
                    spellPointObject.powerSpells.nine = true;
                    break;
            }
        }
    });

    return spellPointObject;
}

module.exports = router;