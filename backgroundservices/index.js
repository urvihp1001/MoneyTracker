const express= require("express")
const cron=require("node-cron")
const app=express()
const dotenv=require("dotenv")
const mongoose=require("mongoose")
dotenv.config()
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
    const run=()=>
    {
        cron.schedule('* * * * * *',()=>{
            console.log('running a task every sec')
        })
    }
    run()
    app.listen(process.env.PORT,()=>{
        console.log("server is running on port",process.env.PORT)
    })