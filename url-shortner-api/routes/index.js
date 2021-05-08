const express = require('express');
const router = express.Router();
const sanitize = require('mongo-sanitize');

const Url = require('../models/url');

// @route   GET /:code
// @Desc    Redirect to long/original url
router.get('/:code', async (req, res) => {
    req.params = sanitize(req.params);
    try {
        const url = await Url.findOne({ urlCode: req.params.code });
        const custom = await Url.findOne({ customUrl: req.params.code });

        if (url) {
            return res.redirect(url.longUrl);
        } else if(custom){
            return res.redirect(custom.longUrl);
        } else {
            res.status(404).json('No url found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});

module.exports = router;