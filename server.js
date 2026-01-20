require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/config');

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    });