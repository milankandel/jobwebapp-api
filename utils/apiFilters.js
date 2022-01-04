const Job=require('../Models/job')

class Apifilters{
    constructor(queryString){
        this.queryString=queryString
    }

     filter(){
         let sorting={...this.queryString}
       let queryCopy={...this.queryString}
       
       let removeFields=['sort','limit','page']
       removeFields.forEach(el=> delete queryCopy[el])
       
       
       
       let queryStr=JSON.stringify(queryCopy)
       let sortCopy=JSON.stringify(Object.values(sorting))
       var datas=(JSON.parse(sortCopy)[0])
       console.log(typeof(Object.assign(datas)))
       
       
       queryStr=queryStr.replace(/\b(gt|lt|gte|lte|et)\b/g,match=>`$${match}`)
      // console.log(JSON.parse(queryStr)) 
       const data= Job.find(JSON.parse(queryStr)).sort({[datas]:1}).l
       return data;
    }
   
    }
   





module.exports=Apifilters