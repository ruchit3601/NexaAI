require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'https://nexa-ai-one-opal.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

const ragRoutes = require('./routes/rag');
app.use('/api/rag', ragRoutes);
const imageRoutes = require('./routes/image');
app.use('/api/image', imageRoutes);
const sttRoutes = require('./routes/stt');
app.use('/api/stt', sttRoutes);
// const ttsRoutes = require('./routes/tts');
// app.use('/api/tts', ttsRoutes);
const visionRoutes = require('./routes/vision');
app.use('/api/vision', visionRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));