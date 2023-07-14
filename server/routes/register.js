var express = require('express');
var router = express.Router();
const User = require('../schema');

router.post('/', async function (req, res) {
    const user = await User.findOne({email: req.body.email});

    if (user) {
        return res.status(409).send('Email is already registered!');
    } else {
        const newUserData = new User({
            email: req.body.email
        });

        newUserData.password = newUserData.generateHash(req.body.password);
        await newUserData.save()

        return res.send(req.body);// echo the result back
    }
});

module.exports = router;