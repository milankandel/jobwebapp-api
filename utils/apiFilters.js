const Job=require('../Models/job')

class Apifilters{
    constructor(queryString){
        this.queryString=queryString
    }

     filter(){
       let queryCopy={...this.queryString}
       
       let queryStr=JSON.stringify(queryCopy)
       queryStr=queryStr.replace(/\b(gt|lt|gte|lte|et)\b/g,match=>`$${match}`)
       console.log(JSON.parse(queryStr)) 
       const data= Job.find(JSON.parse(queryStr))
       return data;
    }
}


module.exports=Apifilters