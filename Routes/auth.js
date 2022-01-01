const { registerUser,login, forgetPassword, resetPassword, logout } = require('../controller/authController')
const { isAuthenticated } = require('../middleware/authentication')

const authRouter=require('express').Router()
authRouter.post("/user/register",registerUser)
authRouter.post("/user/login",login)
authRouter.post("/password/forget",forgetPassword)
authRouter.post("/password/reset/:token",resetPassword)
authRouter.get("/logout",isAuthenticated,logout)
module.exports=authRouter