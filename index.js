const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./db/conn")
const userroute = require("./route/user.route")
const sweetroute = require("./route/sweet.route")
require("dotenv").config()


app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,   // allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use('/uploads',express.static('uploads'))


app.use("/api",userroute)
app.use("/api/sweets",sweetroute)

// Start server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  connectDB();
  app.listen(process.env.PORT, () => {
    console.log("Server running on PORT", process.env.PORT);
  });
}


module.exports = app;