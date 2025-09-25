const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./db/conn")
const userroute = require("./route/user.route")
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


app.use("/api",userroute)

// Start server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  connectDB();
  app.listen(process.env.PORT, () => {
    console.log("Server running on PORT", process.env.PORT);
  });
}


module.exports = app;