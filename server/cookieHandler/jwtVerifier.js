const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

function authenticateJWT(req, res, next) {
    const token = req.cookies.authToken;

    if (token) {
        //console.log("Token before verification:", token);

        jsonwebtoken.verify(token, jwtSecret, (err, user) => {
            if (err) {
                //console.log("Error in verifier: " + err);
                return res.sendStatus(403);  // Forbidden
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);  // Unauthorized
    }
}

module.exports = { authenticateJWT };