const router = require('express').Router();
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken')
const CryptoJS = require('crypto-js');
const User = require('../models/User');
const { verifyAdmin } = require('../middlewares/verifyAdmin');


// UPDATE USER
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updatedUser)
    } catch (err) {
        res.status(500).json(err)
    }
});
// DEELETE USER
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...")
    } catch (err) {
        res.status(500).json(err)
    }
})

// GET USER
router.get('/find/:id', verifyAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others)
    } catch (err) {
        res.status(500).json(err)
    }
});

// GET ALL USERS
// 1.24.51
router.get('/', verifyAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json(err)
    }
})

// GET USER STATS

router.get('/stats', verifyAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } }, //check condition
            { $project: { month: { $month: '$createdAt' } } }, // get month from ceatedAt
            { $group: { _id: '$month', total: { $sum: 1 } } }  // sum with 1 if more then one
        ])
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;