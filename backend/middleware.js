
const jwt=require("jsonwebtoken");

const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;

    if(!authHeader||!authHeader.startsWith('Bearer ')){
        return res.status(403).json({});
    }

    const token=authHeader.split(' ')[1];
    try{
        const decoded=jwt.verify(token,process.env.JWT_TOKEN);

        if(decoded.userId){
            req.userId=decoded.userId;
            next();
        }
        else{
            return res.status(403).json({
                message:"Invalid Token"
            });
        }
    }
    catch(err){
        return res.status(403).json({
            message:err||"Invalid Token"
        });
    }
};

module.exports={
    authMiddleware,
}