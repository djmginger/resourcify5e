var express = require('express');
var router = express.Router();
const User = require('../schema');
const jsonwebtoken = require("jsonwebtoken");
const { authenticateJWT } = require('../cookieHandler/jwtVerifier');

router.post('/', async function (req, res) {
    try {
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            console.log("User not found");
            return res.status(404).send('User not found');
        }

        if (!user.validPassword(req.body.password)) {
            console.log("Password doesn't match")
            return res.status(401).send('Password does not match');
        } else {
            console.log("Password matches!")

            const authToken = jsonwebtoken.sign({ email: user.email }, "YOUR_SECRET_KEY_HERE", {
                expiresIn: '24h'  // token will expire in 24 hours
            });

            // Set JWT as a cookie
            res.cookie("authToken", authToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                // secure: true, // use this in production when using HTTPS
            });

            return res.sendStatus(200);
        }
    } catch (err) {
        console.log("Error occurred", err);
        return res.status(500).send('Error occurred');
    }
});

router.post('/logout', authenticateJWT, function (req, res) {
    res.clearCookie("authToken");
    return res.sendStatus(200);
});

router.get('/validate-token', authenticateJWT, (req, res) => {
    // If the middleware `authenticateJWT` does not throw an error, the JWT is valid.
    return res.status(200).json({ valid: true, email: req.user.email });
});

module.exports = router;