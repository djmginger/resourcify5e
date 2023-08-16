const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
    res.send('Cleric is alive!');
});

setInterval(() => {
    axios.get(`https://api.resourcify5e.com/cleric`)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error pinging self:', error.message);
        });
}, 13 * 60 * 1000);

module.exports = router;