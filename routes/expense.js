const express=require("express")

const router=express.Router()
const Expense=require("../models/expense")
//Add expense
//api- post uri
router.post("/",async(req,res)=>{
    console.log(req.body)
    const newexpense=await Expense(req.body);
try{

const expense=newexpense.save();
res.status(201).json(expense)
//A 201 status code, or "Created," in HTTP indicates that 
// the request was successful and 
// resulted in the creation of a new resource, 
// often in response to a POST request, and 
// typically includes a Location header 
// with the URL of the new resource. 

}catch(err)
{
res.status(500).json(err)
}
})
//get all expenses
router.get("/",async (req,res)=>{
    try{
        const expenses=await Expense.find().sort({createdAt:-1})//mongodb sorting= latest comes first so descending
        res.status(200).json({expenses});
    }catch(err)
    {
        res.status(500).json(err)
    }

})
//update expenses
router.put("/:id",async(req,res)=>{
    try{
        const expense=await Expense.findByIdAndUpdate(
            req.params.id, //tells us which expense is updated as decided by us
            {
                $set:req.body //update as per body content
            },
            {new: true}
            
        );
        res.status(201).json({expense});
    }catch(err)
    {
        res.status(500).json(err)
    }
})
//delete
router.delete("/:id",async(req,res)=>{
try{
await Expense.findByIdAndDelete(req.params.id)
res.status(201).json("deleted successfully");
}catch(err)
{
    res.status(500).json(err)
}
})
module.exports=router