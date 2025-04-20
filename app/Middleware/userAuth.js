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
  try {
    let token = req.headers['x-access-token'];
    if (!token) {
      token = req.body.token || req.query.token;
    }

    if (!token) {
      return res.status(400).json({ message: 'Token is required to access this page' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'You are not an authenticated user.' });
    } else {
      return res.status(401).json({ message: 'Authentication failed.' });
    }
  }
   
}

module.exports={hashpassword,AuthCheck};