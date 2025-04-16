const mongoose=require("mongoose")
const ExpenseSchema=mongoose.Schema({
name:{type:String, require:true},
method:{type:String, require:true},
category:{type:String, require:true},
amount:{type:Number, require:true},
date:{type:String, require:true}

})

module.exports=mongoose.model("expense",ExpenseSchema)


