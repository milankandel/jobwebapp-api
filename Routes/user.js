
const { getCurrentUser, updatePassword,deleteUser, getAppliedJobs } = require('../controller/User')
const {isAuthenticated}=require('../middleware/authentication')
const userRouter=require('express').Router()



userRouter.route("/currentUser").get(isAuthenticated,getCurrentUser)
userRouter.route("/applied/job").get(isAuthenticated,getAppliedJobs)
userRouter.route("/update/password").post(isAuthenticated,updatePassword)
userRouter.route("/deleteCurrentUser").delete(isAuthenticated,deleteUser)
module.exports=userRouter