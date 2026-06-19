const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// loads our .env variables so we can use process.env anywhere
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/auth.routes');
const capsuleRoutes = require('./routes/capsule.routes');
const wallRoutes = require('./routes/wall.routes');

app.use('/api/auth', authRoutes);
app.use('/api/capsules', capsuleRoutes);
app.use('/api/wall', wallRoutes);

// allows our frontend to talk to this backend
app.use(cors());

// lets us read JSON data from incoming requests
app.use(express.json());

// test route to confirm API is running
app.get('/', (req, res) => {
    res.json({ message: 'To the Next Version API is running!' });
});

// connect to MongoDB first, then start the server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected!');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });