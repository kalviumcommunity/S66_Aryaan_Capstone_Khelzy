const User = require('../Model/user.model')

const getUsers = async(req,res)=>{
    try{
       
        const user = await User.find()
        res.status(200).json({
            success:true,
            users:user
        })
        

    }catch(error){
        res.status(500).json({error:error.message})
    }
}






module.exports = {getUsers}

