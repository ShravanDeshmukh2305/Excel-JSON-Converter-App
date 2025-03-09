const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/fileRoutes');
const dotenv = require('dotenv');


const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/files', fileRoutes);


const PORT = process.env.PORT || 5000;
app.listen(5000, () => console.log(`Server running on port ${PORT}`));