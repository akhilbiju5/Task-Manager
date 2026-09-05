require("dotenv").config();
const express = require("express")
const app = express()

const cors = require("cors");
const connectdb = require("./config/db");

const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes");
const authMiddleware = require("./middleware/authMiddleware");


app.use(cors())

//middleware
app.use(express.json())
app.use("/api/tasks" ,taskRoutes)
app.use("/api/auth",authRoutes)

//connecting mongoose
connectdb();

app.get("/" , (req ,res)=>
{
    res.send("Task Manager Backend Running")
})




//start server

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>
{
    console.log(`server is running ${PORT}`)
}) 







