var express = require('express');
var router = express.Router();
const User = require('../schema');
const { authenticateJWT } = require('../cookieHandler/jwtVerifier');

router.put('/updatePass', authenticateJWT, async function (req, res) {
    try {
        const email =  req.user.email;
        const user = await User.findOne({email: email});

        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;

        if (!user) {
            console.log("User not found");
            return res.status(404).send('User not found');
        }

        if (!user.validPassword(oldPassword)) {
            console.log("Password does not match")
            return res.status(401).send('Password does not match');
        } else {
            console.log("Password matches!")
            user.password = user.generateHash(newPassword);
            await user.save();

            return res.status(200).json({ message: 'Password updated successfully' });
        }
    } catch (err) {
        console.log("Error occurred", err);
        return res.status(500).send('Error occurred');
    }
});

router.delete('/', authenticateJWT, async function (req, res) {
    try {
        const email =  req.user.email;

        const result = await User.deleteOne({ email: email });

        if (result.deletedCount === 0) {
            return res.status(404).send('User not found');
        } else {
            //If the deletion was successful, clear the cookie in preparation of following logout
            res.clearCookie("authToken");
        }

        return res.status(200).send('User deleted successfully');

    } catch (err) {
        console.log("Error occurred", err);
        return res.status(500).send('Error occurred');
    }
});

module.exports = router;