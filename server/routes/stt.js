const express = require('express');
const multer = require('multer');
const path = require('path');
const { transcribe } = require('../controllers/sttController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.webm`);
  },
});

const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } });

router.post('/transcribe', upload.single('audio'), transcribe);

module.exports = router;