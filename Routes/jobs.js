const { createJobs, fetchAllJobs, deleteAllJobs, deleteById, findJobByRadiusAndDistance } = require('../controller/job')

const jobRouter=require('express').Router()

jobRouter.route("/jobs").get(fetchAllJobs)
jobRouter.route("/job/new").post(createJobs)
jobRouter.route("/jobs/delete").delete(deleteAllJobs)
jobRouter.route("/job/delete/:id").delete(deleteById)
jobRouter.route("/jobs/:zipcode/:distance").get(findJobByRadiusAndDistance)

module.exports=jobRouter

