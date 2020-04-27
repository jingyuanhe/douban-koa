const qiniu=require('qiniu');
const nanoid=require('nanoid');
const config=require('../config');
const cfg = new qiniu.conf.Config();
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK,config.qiniu.SK);
var bucketManager = new qiniu.rs.BucketManager(mac,cfg);
const mongoose=require('mongoose');
const Movie=mongoose.model("Movie");
const uploadToQiniu=async (url,key)=>{
    return new Promise((resolve,reject)=>{
      bucketManager.fetch(url,config.qiniu.Bucket,key,function(respErr,
            respBody, respInfo) {
            if (respErr) {
              reject(respErr);
              console.log(respErr)
            }else{
              if (respInfo.statusCode == 200) {
                resolve({key})
              } else {
                reject(respInfo)
              }
            }
           
          })
    })
}
;(
  async ()=>{
  let movies=await Movie.find({
    $or:[
      {
        videoKey:{$exists:false}
      },
      {
        videoKey:null
      },{
        videoKey:''
      }
    ]
  })
  for(let i=0;i<movies.length;i++){
    let movie=movies[i];
    if(movie.video&&!movie.key){
      try{
        let videoData=await uploadToQiniu(movie.video,nanoid()+'.mp4');
        let coverData=await uploadToQiniu(movie.cover,nanoid()+'.jpg');
        let posterData=await uploadToQiniu(movie.poster,nanoid()+'.jpg');
        if(videoData.key){
          movie.videoKey=config.qiniu.video+videoData.key;
        }
        if(coverData.key){
          movie.coverKey=config.qiniu.video+coverData.key;
        }
        if(posterData.key){
          movie.posterKey=config.qiniu.video+posterData.key;
        }
        await movie.save();
      }catch(err){
        console.log(err);
      }
    }
  }
  }

)()