const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Connect to DB
connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

app.use('/', require('./routes/index'));
app.use('/api/url', require('./routes/url'));

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})
