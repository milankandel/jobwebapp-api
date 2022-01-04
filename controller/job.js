const Job = require("../Models/job");
const geocoder = require("../utils/Geocoder");
const slugify = require("slugify");
const errorHandler = require("../ErrorHandler/errorHandler");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");

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
