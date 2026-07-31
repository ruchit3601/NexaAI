const express = require('express');
const { createImage } = require('../controllers/imageController');

const router = express.Router();
router.post('/generate', createImage);

module.exports = router;