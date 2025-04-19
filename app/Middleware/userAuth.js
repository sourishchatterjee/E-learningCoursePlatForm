const bcrypt = require('bcryptjs');
const { decode } = require('jsonwebtoken');
const jwt = require('jsonwebtoken')


const hashpassword = async(password) =>{

    try{
        const salt=10;
        const hashedpassword = await bcrypt.hash(password,salt);
        return hashedpassword;
    }catch(err){
        console.log(err);
        
    }
   
}

const AuthCheck=async(req,res,next)=>{
    const token= req.body.token || req.query.token || req.headers['x-access-token'];
    
    if(!token){
        return res.status(400).json({
            message:'Token is required for access this page'
        });
    }
    try{
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded;
        console.log('after login data',req.user);
        return next();

    }catch(err){
       return res.status(400).json({
            message:'You are not authenticate user'
        });
    }
   

}

module.exports={hashpassword,AuthCheck};