const express = require('express');
const router = express.Router();
const User = require('../schema');
const mongoose = require("mongoose").default;

const db = mongoose.connection;

router.get('/', async (req, res, next) => {
    try {
        //lists uid's for ALL objects
        const data = await User.find(); // Await the User.find() method call
        res.json(data);

        //only lists defined uid for user
        // const data = await db.collection("users").find().toArray();
        // res.json(data);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

module.exports = router;