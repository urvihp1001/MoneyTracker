const dotenv=require("dotenv")
const sendMail=require("../helpers/sendMail")
const Expense=require("../models/expense")
dotenv.config()

const expenseEmail=async()=>{
const expenses=await Expense.find()
const totalExpense=expenses.reduce(
    (acc,expense)=>acc+expense.value,0//accumulation of expenses expense+=exp
    //starts adding from 0 every month

)
if(totalExpense>30000){
    let messageOption={
        from: process.env.EMAIL,
        to:process.env.ADMIN_EMAIL,
        subject:"Warning",
        text:"Your total expense is ${totalExpense}"
    }
    await sendMail(messageOption)
}
}
module.exports.expenseEmail;