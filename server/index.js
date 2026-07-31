require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ragRoutes = require('./routes/rag');
app.use('/api/rag', ragRoutes);
const imageRoutes = require('./routes/image');
app.use('/api/image', imageRoutes);
const sttRoutes = require('./routes/stt');
app.use('/api/stt', sttRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));