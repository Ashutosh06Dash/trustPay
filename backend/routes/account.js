const express=require("express");
const router=express.Router();
const { mongoose } = require('mongoose');
const {Account} =require("../db")
const bodyParser = require('body-parser');
const { authMiddleware } = require("../middleware");

const app=express();
app.use(express.json());
app.use(bodyParser);
router.get("/balance",authMiddleware,async(req,res)=>{
    try{
        const account=await Account.findOne({
            userId:req.userId
        });
        return res.status(200).json({
            balance: account.balance/100
        })
    }
    catch(err){
        return res.status(400).json({
            message:err
        });
    }
    
});

router.post("/transfer",authMiddleware,async(req,res)=>{
    const session=await mongoose.startSession();

    session.startTransaction();
    const {amount,toId}=req.body;
    const fromAccount=await Account.findOne({userId:req.userId}).session(session);
    const preciseAmount=Math.floor(amount*100);
    if(!fromAccount || fromAccount.balance<preciseAmount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient Balance"
        });
    }

    const toAccount=await Account.findOne({userId:toId}).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid Account"
        });
    }

    await Account.updateOne({userId:req.userId},{$inc:{balance:-preciseAmount}}).session(session);
    await Account.updateOne({userId:toId},{$inc:{balance:preciseAmount}}).session(session);

    await session.commitTransaction();
    return res.status(200).json({
        message:"Transfer Successful"
    })
})

module.exports=router;
