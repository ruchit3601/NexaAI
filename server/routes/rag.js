const express = require('express');
const multer = require('multer');
const { uploadDocument, askQuestion } = require('../controllers/ragController');

const router = express.Router();
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/upload', upload.single('file'), uploadDocument);
router.post('/ask', askQuestion);

module.exports = router;