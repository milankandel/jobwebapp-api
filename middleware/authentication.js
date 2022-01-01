const errorHandler = require("../ErrorHandler/errorHandler");
const asyncErrorHandler = require("./asyncErrorHandler");
const jwt=require('jsonwebtoken');
const User = require("../Models/User");


exports.isAuthenticated=asyncErrorHandler(async(req,res,next)=>{

    let token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    }else{
        return next(new errorHandler('Login first to access this resource',401))
    }    
    
    const data= await jwt.decode(token)

    const user=await User.findById({_id:data.id})
 
    if(!user){
        return next(new errorHandler('No user found',401))
    }
    req.user=user
    next()

})

 exports.authenticatedRoles=(...roles)=>{
  return (req,res,next)=>{
      if(!roles.includes(req.user.role)){
          return next (new errorHandler(`only ${roles} can access that resource`))
      } 
      next()
  }
 }

 

