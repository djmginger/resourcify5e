var express = require('express');
var router = express.Router();
const User = require('../schema');

router.post('/', async function (req, res) {

    const newUserData = new User({
        email: req.body.email
    });

    newUserData.password = newUserData.generateHash(req.body.password);
    await newUserData.save()

    res.send(req.body);    // echo the result back
});

module.exports = router;