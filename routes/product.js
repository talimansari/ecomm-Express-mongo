const router = require('express').Router();
const { verifyAdmin } = require('../middlewares/verifyAdmin');
const Product = require('../models/Product')
const { verifyToken } = require('../middlewares/verifyToken')

// ADD PRODUCT ADD ONLY ADMIN
router.post('/', verifyAdmin, async (req, res) => {
    const newPoduct = new Product(req.body);
    try {
        const savedProduct = await newPoduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json(err)
    }
})

// PRODUCT UPDATE ONLY ADMIN
router.put('/:id', verifyAdmin, async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updateProduct)
    } catch (err) {
        res.status(500).json(err)
    }
})


// GET ALL PRODUCTS
router.get('/', verifyToken, async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let products
        if (qNew) {
            products = await Product.find().sort({ _id: -1 }).limit(5)
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                }
            })
        } else {
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;