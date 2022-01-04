const User = require("../Models/User");
const Job=require('../Models/job')
const errorHandler = require("../ErrorHandler/errorHandler");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const fs = require('fs');

exports.getCurrentUser=asyncErrorHandler(async(req,res,next)=>{

    const id=req.user.id;
    const user=await User.findById(id).populate({path:'jobPublished',select:'title'})
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

exports.deleteUser = asyncErrorHandler( async(req, res, next) => {

    deleteUserData(req.user.id, req.user.role);
    
    const user = await User.findByIdAndDelete(req.user.id);

  

    res.status(200).json({
        success : true,
        message : 'Your account has been deleted.'
    })
});


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




async function deleteUserData(user, role) {
    if(role === 'employeer') {
        await Job.deleteMany({user : user});
    }

    if(role === 'user') {
        const appliedJobs = await Job.find({'applicantsApplied.id' : user}).select('+applicantsApplied');

        for(let i=0; i<appliedJobs.length; i++) {
            let obj = appliedJobs[i].applicantsApplied.find(o => o.id === user);

            let filepath = `${__dirname}/public/upload/${obj.resume}`.replace('\\controllers', '');

            fs.unlink(filepath, err => {
                if(err) return console.log(err);
            });

            appliedJobs[i].applicantsApplied.splice(appliedJobs[i].applicantsApplied.indexOf(obj.id));

            await appliedJobs[i].save();
        }
    }
}


//get applied job

exports.getAppliedJobs = asyncErrorHandler( async (req, res, next) => {

    const jobs = await Job.find({'applicantsApplied.id' : req.user.id}).select('+applicantsApplied');

    res.status(200).json({
        success : true,
        results : jobs.length,
        data : jobs
    })
});