const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const connectDB = require("./config/DB");
const app = express();

const cors = require("cors");

const PORT = process.env.PORT;

app.use(cors({
  origin: ["https://casa-de-luna.pages.dev", "http://localhost:3000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use((req, res, next) => {
  try {
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`
    );
  } catch (e) {}
  next();
});

connectDB();

const routes = require("./Routes/routes.js");
app.use("/", routes);

app.use((req, res) => {
  res.status(404).send("Route not found!"); 
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
