const { createJobs, fetchAllJobs, deleteAllJobs, deleteById, findJobByRadiusAndDistance, findJobAndUpdate, getJobById, getJobStats, paginateJobs, applyJobs } = require('../controller/job')
const {isAuthenticated,authenticatedRoles}=require('../middleware/authentication')
const jobRouter=require('express').Router()

jobRouter.route("/jobs").get(fetchAllJobs)
jobRouter.route("/job/:id/:slug").get(getJobById)
jobRouter.route("/job/new").post(isAuthenticated,authenticatedRoles('company','admin'),createJobs)
jobRouter.route("/jobs/delete").delete(deleteAllJobs)
jobRouter.route("/job/delete/:id").delete(deleteById)
jobRouter.route("/jobs/:zipcode/:distance").get(findJobByRadiusAndDistance)
jobRouter.route("/job/update/:id").put(findJobAndUpdate)
jobRouter.route("/stats/:topic").get(getJobStats)
jobRouter.route("/jobpaginate").get(paginateJobs)
jobRouter.route("/job/apply/:id").put(isAuthenticated,authenticatedRoles('user'),applyJobs)

module.exports=jobRouter

