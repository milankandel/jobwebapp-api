const { createJobs, fetchAllJobs, deleteAllJobs, deleteById, findJobByRadiusAndDistance, findJobAndUpdate, getJobById, getJobStats } = require('../controller/job')

const jobRouter=require('express').Router()

jobRouter.route("/jobs").get(fetchAllJobs)
jobRouter.route("/job/:id/:slug").get(getJobById)
jobRouter.route("/job/new").post(createJobs)
jobRouter.route("/jobs/delete").delete(deleteAllJobs)
jobRouter.route("/job/delete/:id").delete(deleteById)
jobRouter.route("/jobs/:zipcode/:distance").get(findJobByRadiusAndDistance)
jobRouter.route("/job/update/:id").put(findJobAndUpdate)
jobRouter.route("/stats/:topic").get(getJobStats)

module.exports=jobRouter

