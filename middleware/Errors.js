const errorHandler = require("../ErrorHandler/errorHandler");

module.exports=(err,req,res,next)=>{
    console.log(err)
    err.statusCode=err.statusCode || 500;
    err.message=err.message || `Internal server error`
   
    if(process.env.NODE_ENV==="DEVELOPMENT"){
      
        res.status(err.statusCode).json({
            success:false,
            error:err,
            errorMessage:err.message || `Internal server error`,
            stack:err.stack
        })
    }
    
    if(process.env.NODE_ENV==="PRODUCTION"){
        let error={...err}
        error.message=err.message;
        if(err.name===`CastError`){
            error=new errorHandler('Cast error',404)
        }

       if(err.name===`ValidationError`){
            const message=Object.values(err.errors).map(value=>value.message)
            error=new errorHandler(message,400)
        } 
        if(error.code===11000){
            Object.keys(error.keyValue).map(data=>{    
            const message=`Dublicate ${data}  entered`
             error=new errorHandler(message,400)
            
            })
          
          
        }
        res.status(err.statusCode).json({
            success:false,
            errorMessage:error.message|| `Internal server error`,
       
        })
    }
}