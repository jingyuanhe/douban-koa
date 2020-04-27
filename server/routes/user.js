const {controller,get,post}=require('../lib/decorator');
const {checkPossword}=require('../service/admin')
@controller('api/v0/user')
class userController{
    @post('/')
        async login(ctx,next){
        const {email,password}=ctx.requuest.body;
        const matchData=await checkPossword(email,password);
        if(!matchData.user){
            return (ctx.body={
                success:false,
                msg:'用户不存在'
            })
        }
        if(matchData.match){
            return (ctx.body={
                success:true
            })
        }
        return (ctx.body={
            success:false,
            msg:'账号或密码错误'
        })
    }
}
module.exports={userController}