const { createJobs, fetchAllJobs, deleteAllJobs, deleteById, findJobByRadiusAndDistance, findJobAndUpdate, getJobById } = require('../controller/job')

const jobRouter=require('express').Router()

jobRouter.route("/jobs").get(fetchAllJobs)
jobRouter.route("/job/:id/:slug").get(getJobById)
jobRouter.route("/job/new").post(createJobs)
jobRouter.route("/jobs/delete").delete(deleteAllJobs)
jobRouter.route("/job/delete/:id").delete(deleteById)
jobRouter.route("/jobs/:zipcode/:distance").get(findJobByRadiusAndDistance)
jobRouter.route("/job/update/:id").put(findJobAndUpdate)

module.exports=jobRouter

