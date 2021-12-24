//importing application main
const app=require('./app')



const dotenv=require('dotenv')

dotenv.config({path:'./config/config.env'})


const port=process.env.PORT
app.listen(port,()=>{
    console.log(`Server started at port ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

