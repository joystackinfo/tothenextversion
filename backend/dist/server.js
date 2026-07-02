"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const capsuleRoutes = require('./routes/capsule.routes'); // it is a ts file but using require to avoid import issues with CommonJS modules
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: 'https://tothenextversion-xyjc.vercel.app',
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, express_fileupload_1.default)());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/capsules', capsuleRoutes);
// Cron job
require('./jobs/capsule.unlock');
// Health check
app.get('/', (req, res) => {
    res.json({ message: 'To the Next Version API is running!' });
});
// MongoDB connection
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then(() => {
    console.log('MongoDB connected!');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('MongoDB connection error:', err.message);
});
