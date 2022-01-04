const mongoose = require("mongoose");
const validator = require("validator");
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const crypto=require('crypto')

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        validate: [validator.isEmail, "Please enter a valid email address"],
        unique: true,
      },
      password: {
        type: String,
        select: false,
        minLength: [8, "Password must be atleast of 8 character"],
        required: [true, "Please enter password for your account"],
      },
      role: {
        type: String,
        enum: {
          values: ["user", "company"],
          message: "Please select a correct role",
        },
        default: "user",
      },
      createdAt:{
          type:Date,
          default:Date.now
      },
      resetPasswordToken:String,
      resetPasswordExpire:Date,
},{
  toJSON:{virtuals:true}
})

userSchema.pre('save',async function(next){
     if(!this.isModified('password')){
       next()
     }
    this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods={
    autheticate : async function(password){
     return await bcrypt.compare(password,this.password)
    },
    getJwtToken:async function(){
      return jwt.sign({id:this._id,name:this.name,email:this.email},process.env.JWT_SECRET,{ expiresIn: '2d' })
    },
    
    getUserResetToken :  function(){
      const token=crypto.randomBytes(20).toString('hex')
      this.resetPasswordToken= crypto.createHash('sha256').update(token).digest('hex')
      this.resetPasswordExpire=Date.now()+30*60*1000
      return token;
    }
}


userSchema.virtual('jobPublished',{
  ref:'Job',
  localField:'_id',
  foreignField:'user',
  justOne:false
})




module.exports=mongoose.model('User',userSchema)