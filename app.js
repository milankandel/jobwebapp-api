
const express=require('express')
const morgan=require('morgan')
const dotenv=require('dotenv')
const app=express()

//database connection
const createConnection=require('./config/database')



dotenv.config({path:'./config/config.env'})

createConnection()

app.use(morgan('dev'))


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
  

const jobRouter=require('./Routes/jobs')
app.use(jobRouter)



module.exports=app;


