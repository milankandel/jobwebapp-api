const Job=require('../Models/job')
const slugify=require('slugify')


exports.fetchAllJobs=async (req,res,next)=>{
   
    const jobs=await Job.find()
    res.status(200).json({
        success:true,
        data:jobs,
        result:jobs.length
    })
}



exports.createJobs=async(req,res,next)=>{
    const job=await Job.create(req.body)
    res.status(200).json({
        success:true,
        data:job,
        message:'Job created'
    })
    
}


exports.deleteAllJobs=async(req,res,next)=>{
    const job=await Job.deleteMany()
    res.status(200).json({
        success:true,
        message:'All job deleted'
    })
}


exports.deleteById=async(req,res,next)=>{
    const id=req.params.id;
    res.status(200).json({
        id
    })
}