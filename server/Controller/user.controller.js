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

const createUser = async(req,res)=>{
    const{username,email,password} = req.body;
    try{
        if(!username){
            return res.status(400).send("Username is required to be filled")
        }
        if(!email){
            return res.status(400).send("Email is required to be filled")
        }
        if(!password){
            return res.status(400).send("Password is required to be filled")
        }

        const exsistingUser = await mockUsers.find(user=>user.email === email);
        if(exsistingUser){
            return res.status(400).send("User with this email already exsist")
        }

        const newUser=({
            username,
            email,
            password
        })

        mockUsers.push(newUser)

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

