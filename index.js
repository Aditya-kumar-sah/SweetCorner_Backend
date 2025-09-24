const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./db/conn")
const userroute = require("./routes/user.route")
require("dotenv").config()


app.use(express.json())

app.use(cors({
  origin: '*', 
  methods: "*",         
  allowedHeaders: "*", 
  credentials: true                            
}));

app.use(cookieParser())
app.use('/uploads',express.static('uploads'))


// Connect DB
connectDB();

app.use("/api/v1/2025/user",userroute)

// Start server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT, () => {
    console.log("Server running on PORT", process.env.PORT);
  });
}


module.exports = app;