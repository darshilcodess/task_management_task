const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const { apiLimiter } = require("./middleware/rate-limiter");

const v1Routes = require('./routes/v1/routes');

const app = express();

app.use(apiLimiter);

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1', v1Routes);

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Task Management API running'
    });
});

module.exports = app;
