const express= require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const expenseRoute=require("./routes/expense")
dotenv.config()
const app=express()
//MIDDLEWARE

app.use(express.json())
app.use(cors())//specify url using this to access server
//server can take req from any url
//routes
app.use("/expenses",expenseRoute);
//DB connection
mongoose.connect(process.env.DB_CONNECTION).then(
    ()=>
    {
        console.log("DB connection is successful")
    }
).catch((err)=>
    {
        console.log(err)
    })
//then() after connecting what to do
app.listen(process.env.PORT,()=>{
    console.log("server is running on port",process.env.PORT)
})