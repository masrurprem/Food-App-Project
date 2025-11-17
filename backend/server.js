const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const prisma = require("./src/db/prisma-client");
const userRouter = require("./src/routes/userRouter");
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/user", userRouter);

// // Routes
// app.use("/api", require("./routes/api"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

//
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
