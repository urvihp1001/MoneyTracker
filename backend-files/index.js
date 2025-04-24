const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose= require("mongoose");
const expenseRoute=require("./routes/expense")

dotenv.config()
const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/v1/expenses",expenseRoute)

// DB CONNECTION

mongoose.connect(process.env.DB_CONNECTION).then(() =>{
    console.log("DB connection is successfull")
}).catch((e) =>{
    console.log(e)
})

// start server
const PORT=process.env.PORT;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})