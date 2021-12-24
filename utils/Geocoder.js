const Nodegeocoder=require('node-geocoder')
const dotenv=require('dotenv')
dotenv.config({path:'../config/config.env'})


console.log(process.env.MAPQUEST_KEY)
const options = {
    provider: process.env.MAP_PROVIDER,
    apiKey:process.env.MAPQUEST_KEY, 
    httpAdaptor:'null',
    formatter:null
    
  };

  const geocoder = Nodegeocoder(options);

  module.exports=geocoder




  