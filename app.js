
const express=require('express')
const morgan=require('morgan')
const dotenv=require('dotenv')
const cookieParser=require('cookie-parser')
const errorMiddleware = require('./middleware/Errors')
const app=express()

//database connection
const createConnection=require('./config/database')




dotenv.config({path:'./config/config.env'})



createConnection()


app.use(cookieParser())
app.use(morgan('dev'))






app.use(express.json())
app.use(express.urlencoded({ extended: true }));
  


const jobRouter=require('./Routes/jobs')
const errorHandler = require('./ErrorHandler/errorHandler')
const authRouter = require('./Routes/auth')
const userRouter = require('./Routes/user')



app.use(authRouter)
app.use(userRouter)
app.use(jobRouter)
app.all('*',(req,res,next)=>{
    next(new errorHandler('Route not found',404))
})
app.use(errorMiddleware)



module.exports=app;


