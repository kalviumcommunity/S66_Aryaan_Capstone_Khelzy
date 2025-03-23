const User = require('../Model/user.model')

const mockUsers = [
    {
        
        username: "john_doe",
        email: "john@example.com",
        password: "hashedPassword123"
    },
    {
        
        username: "jane_smith",
        email: "jane@example.com",
        password: "hashedPassword456"
    },
    {
        
        username: "mike_wilson",
        email: "mike@example.com",
        password: "hashedPassword789"
    }
];

const getUsers = async(req,res)=>{

    try{
        res.status(200).json({
            success:true,
            users:mockUsers
        })


    }catch(error){
        res.status(500).json({error:error.message})
    }
}


module.exports = {getUsers}

