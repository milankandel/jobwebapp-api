const mongoose=require('mongoose')




const connection= async()=>{  await mongoose.connect(process.env.DATABASE,{
    useUnifiedTopology: true,
    useNewUrlParser: true 
  }).then(conn=>console.log('Connected to database'))
}
module.exports=connection