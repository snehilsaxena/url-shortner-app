const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');
const sanitize = require('mongo-sanitize');

const Url = require('../models/url');

// @route   POST api/url/shorten
// @Desc    Create short URL
router.post('/shorten', async (req, res) => {
    req.body = sanitize(req.body);
    const { longUrl, customUrl } = req.body;
    const baseUrl = config.get('baseUrl');
    console.log(req.body);

    // Check base url
    if (!validUrl.isUri(baseUrl)) {
        return res.status(400).json('Invalid base url');
    }

    // Check long url
    if (validUrl.isUri(longUrl)) {
        try {
            let url = await Url.findOne({ longUrl });

            if (url) {
                res.json(url);
            } else {
                // Create url code
                const urlCode = shortid.generate();
                const shortUrl = baseUrl + '/' + urlCode;

                if (customUrl) {

                    let custom_url = await Url.findOne({ customUrl });

                    if (custom_url) {
                        res.status(400).json('Custom Url unavailable');
                    } else {
                        url = new Url({
                            longUrl,
                            shortUrl,
                            urlCode,
                            customUrl,
                            date: new Date()
                        });

                        await url.save();
                        res.json(url);
                    }

                } else {
                    url = new Url({
                        longUrl,
                        shortUrl,
                        urlCode,
                        customUrl,
                        date: new Date()
                    });

                    await url.save();
                    res.json(url);
                }
            }
        } catch (err) {
            console.error(err);
            res.status(500).json('Server error');
        }
    } else {
        res.status(400).json('Invalid long url');
    }
});

module.exports = router;