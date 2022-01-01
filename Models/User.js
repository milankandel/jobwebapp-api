const mongoose = require("mongoose");
const validator = require("validator");
const { schema } = mongoose;

const userSchema = new schema({
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
  resetPasswordExpire:Date
});


module.exports=mongoose.model('User',userSchema)