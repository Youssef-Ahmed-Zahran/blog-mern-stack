const express = require("express");
const app = express();
const conectToDB = require("./config/db");
const { notFound, errorHanlder } = require("./middlewares/errors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Express Usages
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: ["http://localhost:5173", "https://blog-reactjs-zeta.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
  credentials: true,
};
app.use(cors(corsOptions));

// Connection To Database
conectToDB();

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/auth", require("./routes/auth"));

// Error Handler Middleware
app.use(notFound);
app.use(errorHanlder);

// Running the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
