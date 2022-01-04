const { getCurrentUser, updatePassword } = require('../controller/User')
const {isAuthenticated}=require('../middleware/authentication')
const userRouter=require('express').Router()



userRouter.route("/currentUser").get(isAuthenticated,getCurrentUser)

userRouter.route("/update/password").post(isAuthenticated,updatePassword)
module.exports=userRouter