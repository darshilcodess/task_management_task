const express = require("express");
const cors = require("cors");
const v1Routes = require("./routes/v1/routes");
const rateLimiter = require("./middleware/rate-limiter");
require("./db/config");

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

app.use("/api/v1", v1Routes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error"
  });
});

module.exports = app;
