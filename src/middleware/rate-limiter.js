const rateLimit = require("express-rate-limit");

// General API rate limiter
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,           
  standardHeaders: true,  
  legacyHeaders: false,   
  message: {
    success: false,
    message: "Too many requests, please try again later."
  }
});

// Strict limit for auth routes
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempts, please try again later."
  }
});
