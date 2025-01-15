const express = require('express');
const loginController = require('../controllers/auth/loginController');
const registerController = require('../controllers/auth/registerController');

const router = express.Router();

// POST /api/login
router.post('/login', loginController);

// POST /api/auth/register
router.post('/register', registerController);

module.exports = router;
