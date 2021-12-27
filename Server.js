//importing application main
const app=require('./app')



const dotenv=require('dotenv')

dotenv.config({path:'./config/config.env'})


const port=process.env.PORT
const server=app.listen(port,()=>{
    console.log(`Server started at port ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})


process.on('unhandledRejection',err=>{
    console.log(`Error: ${err.message}`)
    server.close(()=>{
        process.exit(1)
    })
})



process.on('uncaughtException',err=>{
    console.log(`Error: ${err.message}`)
    server.close(()=>{
        process.exit(1)
    })
})

