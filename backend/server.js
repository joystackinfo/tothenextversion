const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware 
app.use(cors({
    origin:'https://tothenextversion-xyjc.vercel.app',
    credentials: true
}));

app.use(express.json());
app.use(fileUpload())

// routes
const authRoutes = require('./routes/auth.routes');
const capsuleRoutes = require('./routes/capsule.routes');
const wallRoutes = require('./routes/wall.routes');

app.use('/api/auth', authRoutes);
app.use('/api/capsules', capsuleRoutes);
app.use('/api/wall', wallRoutes);

require('./jobs/capsule.unlock');

app.get('/', (req, res) => {
    res.json({ message: 'To the Next Version API is running!' });
});

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