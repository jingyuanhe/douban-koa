const mongoose=require('mongoose');
const User=mongoose.model('User');
const checkPossword=async (email,password)=>{
    let match=false;
    const user=await User.findOne({email});
    if(user){
        match=await user.comparepassword(password,user.password)
    }
    return{
        match,
        user
    }
}
module.exports={
    checkPossword
}