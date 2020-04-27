const mongoose = require('mongoose');
const db = mongoose.connection;
const dbAddress = 'mongodb://localhost/douban';
const glob=require('glob');
const {resolve}=require('path')
mongoose.Promise = global.Promise
exports.initAdmin=async ()=>{
    const User=mongoose.model('User');
    let user=await User.findOne({
        userName:'jingyuanhe'
    });
    if(!user){
        const user=new User({
            userName:'jingyuanhe',
            email:"389026847@qq.com",
            password:'123456'
        })
        await user.save();
    }
}
exports.initSchemas=()=>{
    glob.sync(resolve(__dirname,'./schema','**/*.js')).forEach(require)
}
exports.connect = () => {
    let maxConnectTimes = 0;
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
        mongoose.connect(dbAddress, { useNewUrlParser: true, useUnifiedTopology: true });
        db.on('disconnected', () => {
            maxConnectTimes++;
            if (maxConnectTimes < 5) {
                mongoose.connect(dbAddress, { useNewUrlParser: true, useUnifiedTopology: true });
            } else {
                throw new Error('数据库崩溃，请抓紧修复！')
            }
        })
        db.once('open', () => {
            resolve();
            console.log('mongodb connect successly')
        });
        db.on('error', err => {
            maxConnectTimes++;
            if (maxConnectTimes < 5) {
                mongoose.connect(dbAddress, { useNewUrlParser: true, useUnifiedTopology: true });
            } else {
                throw new Error('数据库崩溃，请抓紧修复！')
            }
        });
    })

}