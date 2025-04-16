const mongoose=require("mongoose")
const ExpenseSchema=mongoose.Schema({
name:{type:String, require:true},
method:{type:String, require:true},
category:{type:String, require:true},
amount:{type:Number, require:true},
date:{type:String, require:true}

})
<<<<<<< HEAD
module.exports=mongoose.model("expense",ExpenseSchema)
=======
module.exports=mongoose.model("expense",ExpenseSchema)
>>>>>>> 48b4d514559fd60bbc96ac8b99d61fc79c615dd4
