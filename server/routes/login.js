var express = require('express');
var router = express.Router();
const User = require('../schema');

router.post('/', async function (req, res) {
    try {
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            console.log("User not found");
            return res.status(404).send('User not found');
        }

        if (!user.validPassword(req.body.password)) {
            //password doesn't match
            console.log("Password doesn't match")
            return res.status(401).send('Password does not match');
        } else {
            //password matched
            console.log("Password matches!")
            return res.send(req.body);    // echo the result back
        }
    } catch (err) {
        console.log("Error occurred", err);
        return res.status(500).send('Error occurred');
    }   // echo the result back
});

module.exports = router;