const Job = require("../Models/job");
const geocoder = require("../utils/Geocoder");
const slugify = require("slugify");
const errorHandler = require("../ErrorHandler/errorHandler");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const path=require('path')

const Apifilters = require("../utils/apiFilters");


exports.fetchAllJobs = asyncErrorHandler(async (req, res, next) => {
  const apiFilters = (await new Apifilters(req.query).filter())
  
  res.status(200).json({
    apiFilters,
    size:apiFilters.length
  });
});


exports.paginateJobs=asyncErrorHandler(async (req,res,next)=>{
  const page=parseInt(req.query.page ,10) || 1
  const limit=parseInt(req.query.limit,10) || 10
  const skipLimit=(page-1)*limit
  const data=await Job.find().skip(skipLimit).limit(limit)
  res.status(200).json({
    success: true,
    data: data,
    message: "Job found",
  });


})

exports.createJobs = asyncErrorHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const job = await Job.create(req.body);
  res.status(200).json({
    success: true,
    data: job,
    message: "Job created",
  });
});

exports.deleteAllJobs = asyncErrorHandler(async (req, res, next) => {
  const job = await Job.deleteMany();
  res.status(200).json({
    success: true,
    message: "All job deleted",
  });
});

exports.findJobByRadiusAndDistance = asyncErrorHandler(
  async (req, res, next) => {
    const { zipcode, distance } = req.params;
    const radius = distance / 3963;
    const datas = await geocoder.geocode(zipcode);
    const { longitude, latitude } = datas[0];
    const jobs = await Job.find({
      location: {
        $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
      },
    });
    res.status(200).json({
      success: true,
      result: jobs.length,
      data: jobs,
    });
  }
);

exports.findJobAndUpdate = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;
  let job = await Job.findById(id);
  console.log(job);
  if (!job) {
    return next(new errorHandler("Job not found", 404));
  }
  const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    data: updatedJob,
    message: "Job updated",
  });
});

exports.deleteById = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;
  const data = await Job.findById(id);
  if (!data) {
    return res.status(404).json({
      message: "That job doesnot exist.You cant delete",
      success: true,
    });
  }
  const job = await Job.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: `Job with ${id} deleted`,
  });
});

exports.getJobById = asyncErrorHandler(async (req, res, next) => {
  const job = await Job.find({
    $and: [{ _id: req.params.id }, { slug: req.params.slug }],
  });
  if (!job || job.length == 0) {
    return res.status(404).json({
      success: true,
      message: "Job with that id and slug is not present",
    });
  }
  return res.status(200).json({
    success: true,
    data: job,
  });
});

exports.getJobStats = asyncErrorHandler(async (req, res, next) => {
  const stat = await Job.aggregate([
    { $match: { $text: { $search: '"' + req.params.topic + '"' } } },
    {
      $group: {
        _id: null,
        totalJobs: { $sum: 1 },
        minSalary: { $min: "$salary" },
        maxSalary: { $max: "$salary" },
        avgSalary: { $avg: "$salary" },
      },
    },
  ]);

  if (stat.length === 0) {
    return res.status(404).json({
      success: true,
      message: `Result not found for ${req.params.topic}`,
    });
  }

  res.status(200).json({
    success: true,
    data: stat,
  });
});



//localhost:8000/job/apply/:id/
exports.applyJobs=asyncErrorHandler(async(req,res,next)=>{
  console.log(req.user.id)
  const id=req.params.id;
  const job=await Job.findById(id).select('+applicantApplied')

  if(!job){
    return next(new errorHandler('Job not found',404))
  }

  job.applicantApplied.map(data=>{
    console.log(data)
    if(data.id===req.user.id){
     return next(new errorHandler('Job already applied',500))
    }
  })

  if(job.lastDate < new Date(Date.now())){
    return next(new errorHandler('You are too late to apply to job',401))
  }
  
  if(!req.files){
    return next(new errorHandler('CV or resume is not uploaded',404))
  }

  const file=req.files.file
  const supportedFiles= /.docx|.pdf/;
  if(!supportedFiles.test(path.extname(file.name))){
    return next(new errorHandler('Please upload supported file type',401))
  }

  if(file.size > process.env.UPLOAD_SIZE){
    return next(new errorHandler('Please upload file less than 2MB',401))
  }

  file.name=`${req.user.name.replace('','_')}_${job._id}${path.parse(file.name).ext}`
  file.mv(`${process.env.UPLOAD_PATH}/${file.name}`,async err=>{
    if(err){
      return next(new errorHandler('Resume upload failed',500))
    }

  

    

    await Job.findByIdAndUpdate(req.params.id,{$push:{
      applicantApplied:{
        id:req.user.id,
        resume:file.name
      }
    }},{
      new:true,
      runValidators:true,
      useFindAndModify:false

    })
    res.status(200).json({
      success:true,
      message:'Job applied successfully',
      data:file.name
    })

  })

  

})
