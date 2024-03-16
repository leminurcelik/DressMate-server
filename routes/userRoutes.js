const express = require('express');

const { signin, signup, updatePassword } = require('../controllers/user.js');

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/updatePassword', updatePassword);

module.exports = router;