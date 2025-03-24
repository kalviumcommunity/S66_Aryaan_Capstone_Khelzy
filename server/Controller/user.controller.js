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

const createUser = async(req,res)=>{
    const{username,email,password} = req.body;
    try{
        if(!username){
            return res.status(400).json({message:"Username is required to be filled"})
        }
        if(!email){
            return res.status(400).json({message:"Email is required to be filled"})
        }
        if(!password){
            return res.status(400).json({message:"Password is required to be filled"})
        }

        const exsistingUser = await User.findOne({email});
        if(exsistingUser){
            return res.status(400).json({message:"User with this email already exsist"})
        }

        const newUser= new User({
            username,
            email,
            password
        })

        await newUser.save()

        res.status(201).json({
            success:true,
            message:"User created successfully",
            user : newUser
        })
    }catch(error){
        res.status(500).json({error:error.message})
    }
}





module.exports = {getUsers,createUser}

