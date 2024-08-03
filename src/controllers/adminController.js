const User = require("../model/UserModel")
const Admin = require("../model/AdminModel")
const Otp = require("../model/OtpModel")
const Recipe = require('../model/RecipeModel');
const bcrypt = require("bcrypt")
const {authenticateToken} = require('../../utilities')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
const crypto = require('crypto');

require('dotenv').config();


const validateAdmin = async (req, res) => {
    const { username, password } = req.body;

    // Check if username or email is provided
    if (!username || !password) {
        return res.json({ error: true, message: "Username and password are required" });
    }

    // Find the user by username or email
    const admin = await Admin.findOne({ username: username });
    
    if (!admin) {
        return res.json({ error: true, message: "Invalid username" });
    }

    // Check if the provided password matches the stored hashed password
    const match = await bcrypt.compare(password, admin.password);
    
    if (!match) {
        return res.json({ error: true, message: "Invalid password" });
    }

    // Generate JWT token
    const accessToken = jwt.sign({ adminId: admin._id, username: admin.username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
    });

    // Return response
    return res.status(200).json({ 
        error: false,
        message: "Login successful",
        accessToken,
        admin: {
            username: admin.username,
            // Exclude sensitive data if needed
        }
    });
};

const getDashboard = async (req, res) => {
    res.json({ 
        error: false,
        admin: req.user,
     });
}

const getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
}

const updateProfile = async (req, res) => {
    const { isLocked  } = req.body;
    const userId = req.params.userId;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isLocked }, 
        { new: true, runValidators: true }
    );
    res.json(updatedUser);
}

const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
}

const updatedUser = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.params.userId;

        // Validate the input if needed
        if (!username || !email) {
            return res.status(400).json({ message: 'Username and email are required' });
        }

        // Update only username and email, exclude password
        const user = await User.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const addUser = async (req, res)=>{
    const { username, email, password } = req.body;

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Send email with user details
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Our Service',
            text: `Hello ${username},\n\nYour account has been created successfully.\nUsername: ${username}\nPassword: ${password}\n\nThank you!`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add user' });
    }
}

const getRecipes = async (req, res)=>{
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
}

const updateRecipe = async (req, res)=>{
    const { recipeId } = req.params;
    const updatedData = req.body;

  try {
    const recipe = await Recipe.findByIdAndUpdate(recipeId, updatedData, { new: true });
    if (!recipe) {
      return res.json({ message: "Recipe not found" });
    }
    res.status(200).json({ message: "Recipe updated successfully", recipe });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const deleteRecipe = async (req, res)=>{
    const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findByIdAndDelete(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
    validateAdmin,
    getDashboard,
    getUsers,
    updateProfile,
    deleteUser,
    updatedUser,
    addUser,
    getRecipes,
    updateRecipe,
    deleteRecipe
}