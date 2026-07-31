const express = require('express');
const multer = require('multer');
const { analyze } = require('../controllers/visionController');

const router = express.Router();
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/analyze', upload.single('image'), analyze);

module.exports = router;