const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);

router.post("/payment", async (req, res) => {
    await stripe.customers.create({ source: req.body.tokenId })
    await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
        payment_method: 'pm_card_visa'

    }),
        (stripeErr, stripeRes) => {
            if (stripeErr) {
                res.status(500).json(stripeErr)
            } else {
                res.status(200).json(stripeRes)
            }
        }
})

module.exports = router;