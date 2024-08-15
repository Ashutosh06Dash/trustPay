const express=require("express");
const router=express.Router();
const jwt = require("jsonwebtoken");
const zod=require('zod');
const {User,Account} =require("../db")
const bodyParser = require('body-parser');
const { authMiddleware } = require("../middleware");
const bcrypt = require('bcrypt');
const app=express();
app.use(express.json());
app.use(bodyParser);

const signupSchema=zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string(),
})

router.post("/signup",async(req,res)=>{
    const body=req.body;
    const {success}=signupSchema.safeParse(body);
    if(!success){
        return res.status(411).json({
            message:"Incorrect Data"
        })
    }
    try{
        const existingUser=await User.findOne({
            username: body.username
        });
    
        if(existingUser){
            return res.status(411).json({
                message:"User Exists",
            })
        }
        const salt = await bcrypt.genSalt(10);
        const passwordWithPepper = body.password + process.env.PEPPER;
        const hashedPassword = await bcrypt.hash(passwordWithPepper, salt);
    
        const user=await User.create({
            username: body.username,
            password: hashedPassword,
            firstName: body.firstName,
            lastName: body.lastName,
            salt: salt
        })
        const userId=user._id;
    
        await Account.create({
            userId:userId,
            balance: Math.floor((1+Math.random()*1000)*100),
        })
        const token=jwt.sign({
            userId:userId
        },process.env.JWT_TOKEN);
        res.status(200).json({
            message:"User Created Successfully",
            token: token,
        });
    }
    catch(err){
        return res.status(400).json({
            message:err
        });
    }
    
});

const signinSchema=zod.object({
    username:zod.string().email(),
    password:zod.string()
})

router.post("/signin",async(req,res)=>{
    const body=req.body;
    const {success}=signinSchema.safeParse(body);
    if(!success){
        return res.status(411).json({
            message:"Incorrect Data"
        })
    }
    try{
        const user=await User.findOne({
            username: body.username,
        })
        const passwordWithPepper = body.password + process.env.PEPPER;
        const hashedPassword = await bcrypt.hash(passwordWithPepper, user.salt);
        
        if(user&& hashedPassword==user.password){
            const userId=user._id;
            const token=jwt.sign({userId: userId},process.env.JWT_TOKEN);
            return res.status(200).json({
                token:token
            })
        }
        else{
            return res.status(411).json({
                message: "Error while logging in or incorrect password"
            })
        }
    }
    catch(err){
        return res.status(400).json({
            message:err
        });
    }
    
})


router.get("/userId",authMiddleware,async(req,res)=>{
    try{
        const user=await User.findOne({
            _id:req.userId
        })
        return res.status(200).json({
            user:{
                firstName:user.firstName,
                lastName:user.lastName,
                _id:user._id
            }
        })
    }
    catch(err){
        return res.status(400).json({
            message:err
        });
    }
})

router.get("/bulk",authMiddleware,async(req,res)=>{
    const filter=req.query.filter||"";
    try{
        const users=await User.find({
            $or:[{
                firstName:{
                    "$regex":filter,
                    "$options": 'i'
                }
            },{
                lastName:{
                    "$regex":filter,
                    "$options": 'i'
                }
            }]
        })
    
        res.json({
            user:users.filter(user=>user._id!=req.userId).map(user=>({
                username:user.username,
                firstName:user.firstName,
                lastName:user.lastName,
                _id:user._id
            }))
        })
    }
    catch(err){
        return res.status(400).json({
            message:err
        });
    }
    
})

module.exports=router;