const express = require('express');
const router = express.Router();

// Define user-related routes here
router.get('/', (req, res) => {
res.send('User route');
});
router.get('/:id', async (req, res) => {
try {
    const userId = req.params.id;
    const userController = require('../controllers/userController');
    await userController.getUserById(req, res);
} catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
}
const userId = req.params.id;
const userController = require('../controllers/userController');
});
module.exports = router;

