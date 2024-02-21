const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Token:', authHeader);

    if (!authHeader) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    // Split the header into the Bearer prefix and the token itself
    const parts = authHeader.split(' ');

    // Check if the header has the correct format
    if (parts.length !== 2) {
        return res.status(403).send({ auth: false, message: 'Token error: wrong format.' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(403).send({ auth: false, message: 'Token error: wrong format.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: err.message });
        }

        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });

}

module.exports = verifyToken;