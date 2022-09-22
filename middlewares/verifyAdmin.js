
const { verifyToken } = require('./verifyToken')
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("you are not allowed!")
        }
    })
}

module.exports = { verifyAdmin }