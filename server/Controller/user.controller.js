
const User = require("../Model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
require("dotenv").config();

const getUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({
      success: true,
      users: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username) {
      return res
        .status(400)
        .json({ message: "Username is required to be filled" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required to be filled" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required to be filled" });
    }

    const exsistingUser = await User.findOne({ email });
    if (exsistingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exist" });
    }

    const hash = await bcrypt.hash(password,12)

    const newUser = new User({
      username,
      email,
      password : hash
    });



    await newUser.save();


    const token = jwt.sign(
        {
          userId: newUser._id,
          email: newUser.email,
          username: newUser.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1hr" }
      );


    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, password },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "The user was not found" });
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({message:"Incorrect email or password"})
    }
    

    res.status(200).json({
      message: "Login Successfully",
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, loginUser };

