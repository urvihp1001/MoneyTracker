const express=require("express")
const router=express.Router();
const Expense=require("../models/expense");
router.post("/",async(req,res)=>{
try{
  const newExpense=new Expense(req.body);
  const savedExpense=await newExpense.save();
  res.status(201).json(savedExpense);
}catch(err)
{
  res.status(500).json({message:"Error saving expense",error:err.message});
}
});
router.get("/",async(req,res)=>{
  try{
const expenses=await Expense.find().sort({createdAt:-1});
    res.status(200).json({expenses});
  }catch(err)
  {
    res.status(500).json({message:"Error fetching expenses",error:err.message});
  }
  });
  router.put("/:id",async(req,res)=>{
    try{
  const updatedexpense=await Expense.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true, runValidators:true});
if(!updatedexpense){
  return res.status(404).json({message:"Expense not found"});
}
      res.status(200).json({updatedexpense});
    }catch(err)
    {
      res.status(500).json({message:"Error updating expenses",error:err.message});
    }
    });
    router.delete("/:id",async(req,res)=>{
      try{
    const deletedexpense=await Expense.findByIdAndDelete(req.params.id);
  if(!deletedexpense){
    return res.status(404).json({message:"Expense not found"});
  }
        res.status(200).json({message:"Deleted successfully"});
      }catch(err)
      {
        res.status(500).json({message:"Error updating expenses",error:err.message});
      }
      });
  module.exports=router;