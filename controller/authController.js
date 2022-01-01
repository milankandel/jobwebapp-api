const User=require('../Models/User')
const jwt=require('jsonwebtoken')
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const errorHandler = require('../ErrorHandler/errorHandler');
const sendEMail = require('../utils/sendingMail');
const crypto=require('crypto')

exports.registerUser=asyncErrorHandler(async(req,res,next)=>{
  const{name,password,email,role}=req.body
  const data=await User.create({name,password,email,role})
  
  res.status(200).json({
      success:true,
      message:'User registered'
  })

})


exports.login=asyncErrorHandler(async(req,res,next)=>{
 const{email,password}=req.body
 if(!email || !password){
    return next(new errorHandler('Please enter email and password',404))
 }
 const data=await User.findOne({email}).select('+password')
 if(!data){
     return next(new errorHandler('User with that email didnot exist',404))
 }

 const isMatched=data.autheticate(password)
 if(!isMatched){
    return next(new errorHandler('invalid email or password',404))
 }

 const token=await data.getJwtToken()
 res.cookie("token",token,{
     httpOnly:true,
     expires:new Date(Date.now()+ 7*24*60*60*1000)
 })



 res.status(200).json({
     success:true,
     message:'Sign in action successfull',
     token
 })



 

})


exports.forgetPassword=asyncErrorHandler(async(req,res,next)=>{
const{email,password,token}=req.body;
const user=await User.findOne({email})

if(!user){
    return next(new errorHandler('User with that email doesnot exist',404))
}
const resetUserToken=await user.getUserResetToken()
console.log(resetUserToken)
await user.save({validateBeforeSave:false})

const resetUrl=`${req.protocol}://${req.get('host')}/password/reset/${resetUserToken}`
const message=`Your password reset link is below \n \n ${resetUrl}`

try{

    await sendEMail({
        subject:`Password recovery email`,
        message,email:user.email
    })
    res.json({
        success:true,
        message:`Email sent successfully to ${user.email}`
    })

}catch(error){
user.resetPasswordExpire=undefined
user.resetPasswordToken=undefined
await user.save({validateBeforeSave:false})
return next(new errorHandler('email not sent',500))
}


})


exports.resetPassword=asyncErrorHandler(async(req,res,next)=>{

    const token=req.params.token
    const hashed_token=crypto.createHash('sha256').update(token).digest('hex')
    const user=await User.findOne({resetPasswordToken:hashed_token,resetPasswordExpire:{$gt:Date.now()}})
    if(!user){
        return next(new errorHandler('token doesnot exist',404))
    }
    user.password=req.body.password
    user.resetPasswordToken=undefined
    user.resetPasswordExpire=undefined
    await user.save()

    res.json({
        success:true,
        message:'Password reset successfull'
    })


})