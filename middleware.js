const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        let token = req.header('x-token');
        if (!token) {
            return res.status(401).send({ error: "Unauthorized" });
        }
        let decode = jwt.verify(token, 'jwtSecret');
        req.user = decode.user;
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ error: "Server error" });
    }
}