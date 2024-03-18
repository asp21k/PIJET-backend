require("dotenv").config();
const express = require("express");
const app = express();
const cron = require('node-cron');
const fetch = require('node-fetch'); // Import node-fetch for making HTTP requests
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:8000',
];

// Middleware for CORS handling
app.use(express.json());
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    console.error(`Unallowed origin: ${origin}`); // Log for security tracking
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello, your server is running");
});

app.use("/submit", require("./routes/submit"));
app.use("/user", require("./routes/userRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/fetching", require("./routes/fetching"));
const PORT = process.env.PORT || 5000;

// Schedule a cron job to hit the `/get` route every 1 minute
const task = cron.schedule('*/5 * * * *', () => {
  console.log('Hitting /get route every 1 minute');
  fetch('https://pijet-backend.onrender.com') 
    .then(response => response.text())
    .then(data => console.log('Response from /:', data))
    .catch(error => console.error('Error hitting /:', error));
});

task.start(); // Start the cron job

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
