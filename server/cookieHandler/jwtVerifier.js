const jsonwebtoken = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
    const token = req.cookies.authToken;

    if (token) {
        //console.log("Token before verification:", token);

        jsonwebtoken.verify(token, "YOUR_SECRET_KEY_HERE", (err, user) => {
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