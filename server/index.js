require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-deployed-frontend-url.vercel.app'
    : 'http://localhost:5173',
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