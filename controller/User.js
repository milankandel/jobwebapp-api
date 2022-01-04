const User = require("../Models/User");

const errorHandler = require("../ErrorHandler/errorHandler");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");



exports.getCurrentUser=asyncErrorHandler(async(req,res,next)=>{

    const id=req.user.id;
    const user=await User.findById(id)
    res.status(200).json({
        user
    })

})


exports.updatePassword=asyncErrorHandler(async(req,res,next)=>{
    const id=req.user.id;
    const currentPassword=req.body.currentPassword
    const newPassword=req.body.newPassword
    const user=await User.findById(id).select('+password')
    const isMatched=await user.autheticate(currentPassword)
    console.log(isMatched)
    if(isMatched===false){
        return next(new errorHandler("password doesnot match",401))
    }

    user.password=newPassword
    await user.save()

    res.status(200).json({
        message:"password reset done"
    })



})


exports.updateUser=asyncErrorHandler(async(req,res,next)=>{
    const id=req.user.id
    const user=await User.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true
    })
   res.status(200).json({
       success:true,
       user
   })
})
