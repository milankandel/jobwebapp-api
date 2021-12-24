const mongoose=require('mongoose')
const { default: slugify } = require('slugify')
const validator =require('validator')
const geocoder=require('../utils/Geocoder')

const {Schema}=mongoose



const jobSchema=new Schema({
    title:{
        type:String,
        required:[true,'Please enter job title'],
        trim:true,
        maxlength:[100,'Job title must be less than 100 word']
    },
    slug:String,
    description:{
        type:String,
        required:[true,'Please enter job description'],
        minlength:[20,'Job description must be atleast 20 words']
    },
    email:{
        type:String,
        validate:[validator.isEmail,'Please enter a valid email address']
    },
    address:{
        type:String,
        required:[true,'Please enter the address of company']
    },
    location:{
        type:{
            type:String,
            enum:['Point'],
            
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
          },
          formattedAddress:String,
          city:String,
          state:String,
          zipcode:String,
          country:String,

        

    },
    company:{
        type:String,
        required:[true,'Please add company name']
    },
    industry:{
        type:[String],
        required:true,
        enum:{
            values:['IT','Business','banking','hotel','Construction','finance'],message:'Please select proper industry'
        }
    },
    jobType:{
        type:String,
        required:true,
        enum:{
            values:['Permanent','Temporary','Contract','Internship'],message:'Please select correct option for job types'
        }
    },
    minEducation:{
        type:String,
        required:true,
        enum:{
            values:['Bachelor','Master','phd','undergraduate'],message:'Please select correct option for education'
        }
    },
    position:{
        type:Number,
        default:1
    },
    experience:{
        type:String,
        required:true,
        enum:{
            values:['No experience','1 year-2 years','2 years-5 years','5+ years'],message:'Please select correct option for experience'
        }
    },
    salary:{
        type:Number,
        required:true
    },
    postingDate:{
        type:Date,
        default:Date.now
    },
    lastDate:{
        type:Date,
        default:new Date().setDate(new Date().getDate()+7)
    },
    applicantApplied:{
        type:[Object],
        select:false
    }
})


jobSchema.pre('save',function(next){
    this.slug=slugify(this.title,{lower:true})
    next()
})

jobSchema.pre('save',async function(next){
    const data=await geocoder.geocode(this.address)
    console.log(data)
    this.location={
      type:'Point',
      coordinates:[data[0].longitude,data[0].latitude],
      formattedAddress:data[0].formattedAddress,
      city:data[0].city,
      state:data[0].state,
      zipcode:data[0].zipcode,
      country:data[0].countryCode
  
  }
})

module.exports=mongoose.model('Job',jobSchema)