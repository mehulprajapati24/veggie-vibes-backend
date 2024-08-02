const User = require("../model/UserModel")
const Otp = require("../model/OtpModel")
const Recipe = require('../model/RecipeModel');
const bcrypt = require("bcrypt")
const {authenticateToken} = require('../../utilities')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


const createUserOtp = async (req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ username: username });
    if (user) {
        return res.json({ error: true, message: "Username is already occupied" });
        }
    const emailId = await User.findOne({ email: email });
    if (emailId) {
        return res.json({ error: true, message: "Email already exists" });
        }

        const otp = (crypto.randomInt(100000, 1000000)).toString();
        otpExpires = Date.now() + 60000;

        let otp_data = await Otp.findOne({ email: email });
        if (otp_data) {
            // If document exists, update it
            otp_data.otp = otp;
            otp_data.otpExpires = otpExpires;
        } else {
            // If document does not exist, create a new one
            otp_data = new Otp({
                email: email,
                otp: otp,
                otpExpires: otpExpires
            });
        }

        await otp_data.save();


        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP for verification from Veggie-Recipe-Vibes',
            text: `Your OTP is ${otp}`,
          };

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.error('Error sending email:', err);
              return res.json({ error: true, message: 'Error sending OTP' });
            }
            res.status(201).json({ error: false, message: "OTP sent"});
          });

}


const createUser = async (req, res) => {
    const { username, email, password, otp } = req.body;

    const otpData = await Otp.findOne({ email: email });

    if (Date.now() > otpData.otpExpires) {
        return res.json({ error: true, message: "Expired OTP! Please click on resend otp" });
    }

    if (otpData.otp != otp) {
        return res.json({ error: true, message: "Invalid OTP" });
    }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
            });
            await newUser.save();

            const accessToken = jwt.sign( { userId: newUser._id, username: newUser.username }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "30m",
            });

    return res.status(201).json({ 
        error: false,
        user: {
            username: newUser.username,
            email: newUser.email,
            // Exclude sensitive data if needed
        },
        accessToken,
        message: "Registration Successful",
     });
}


const getDashboard = async (req, res) => {
    res.json({ 
        error: false,
        user: req.user,
        upload_care_key: process.env.UPLOAD_CARE_PUBLIC_KEY
     })
}


const validateUser = async (req, res) => {
    const { username, password } = req.body;

    // Check if username or email is provided
    if (!username || !password) {
        return res.json({ error: true, message: "Username and password are required" });
    }

    // Find the user by username or email
    const user = await User.findOne({ username: username });
    
    if (!user) {
        return res.json({ error: true, message: "Invalid username" });
    }

    // Check if the provided password matches the stored hashed password
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
        return res.json({ error: true, message: "Invalid password" });
    }

    // Generate JWT token
    const accessToken = jwt.sign({ userId: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
    });

    // Return response
    return res.status(200).json({ 
        error: false,
        message: "Login successful",
        accessToken,
        user: {
            username: user.username,
            email: user.email,
            // Exclude sensitive data if needed
        }
    });
};

const forgotPasswordGenerateOtp = async (req, res)=>{
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.json({ error: true, message: "Email not found" });
        }
        const otp = (crypto.randomInt(100000, 1000000)).toString();

        otpExpires = Date.now() + 60000;

        let otp_data = await Otp.findOne({ email: email });
        if (otp_data) {
            // If document exists, update it
            otp_data.otp = otp;
            otp_data.otpExpires = otpExpires;
        }

        await otp_data.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP for verification from Veggie-Recipe-Vibes',
            text: `Your OTP is ${otp}`,
          };

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.error('Error sending email:', err);
              return res.json({ error: true, message: 'Error sending OTP' });
            }
            res.status(201).json({ error: false, message: "OTP sent"});
          });

}

const validateOtpLogin = async (req, res)=>{
    const { email, otp } = req.body;
    
        let otp_data = await Otp.findOne({ email: email });
       
            if (otp_data.otpExpires < Date.now()) {
                return res.json({ error: true, message: "Expired OTP! Please click on resend otp" });
            }
            if (otp !== otp_data.otp) {
                return res.json({ error: true, message: "Invalid OTP" });
                }
            
            res.json({ error: false, message: "OTP verified" });
}

const changePassword = async (req, res)=>{
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let user_data = await User.findOne({ email: email });
    if (user_data) {
        user_data.password = hashedPassword;
        await user_data.save();
        res.json({ error: false, message: "Password changed" });
        }
}

const createRecipe = async (req, res)=>{
    const { recipeName, image, category, instructions, ingredients, preparationTime, cookTime, difficulty, aboutDish } = req.body;
    const user = req.user;
    
    const newRecipe = new Recipe({
        recipeName,
        image,
        category,
        instructions,
        ingredients,
        preparationTime,
        cookTime,
        difficulty,
        aboutDish,
        user: user.userId
      });
      await newRecipe.save();
      res.status(201).json({ message: 'Recipe created successfully'});
}

module.exports = {
    createUser,
    createUserOtp,
    validateUser,
    forgotPasswordGenerateOtp,
    validateOtpLogin,
    changePassword,
    getDashboard,
    createRecipe
}