const Otp = require('../model/resetPassword.model.js')
const User = require('../model/login.model.js')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

exports.sentOtp = async(req, res) =>{
    try {
        const createOtp = Math.floor(100000+(Math.random()*900000))
        const otpEntry = await new Otp({ email: req.params.email, createOtp });
        await otpEntry.save();
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.email_user,
                pass: process.env.email_password
            },
        });

        const mailOptions = {
            from: process.env.email_user,
            to: [req.params.email,

            ],
            subject: "hi this is test process",
            text: 'This is a test for otp.', 
            html: `<p>verification code is <b>${createOtp}</b> </p>`
        }

        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                return console.log("error occur",error)
            }
        })
        res.status(200).json({message:"send otp successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

exports.verifyOtp = async(req, res) =>{
    try {
        const { email, createOtp, newPassword, confirmPassword } = req.body;
    
        // Check if email and otp are provided
        if (!email || !createOtp) {
          return res.status(400).json({ message: 'Email and OTP are required' });
        }
    
        // Find the OTP entry in the database
        const otpEntry = await Otp.findOne({ email });
    
        if (!otpEntry) {
          return res.status(404).json({ message: 'OTP not found or expired' });
        }
    
        // Verify the OTP
        if (otpEntry.createOtp !== createOtp) {
          return res.status(400).json({ message: 'Invalid OTP' });
        }

         // Check if passwords match
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }
      console.log("test ........................")
      // Find the user in the database
      const userDb = await User.findOne({ userName:req.body.email });
      if (!userDb) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      userDb.password = hashedPassword;
      await userDb.save();
    
        // OTP is valid, delete it from the database
        await Otp.deleteOne({ email });
        res.status(200).json({ message: 'reset password successfully.....' });
      } catch (error) {
        console.error('Error verifying OTP:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    };

exports.fogetPassword = async(req, res) =>{
  try {
    const createOtp = Math.floor(100000+(Math.random()*900000))
    const otpEntry = await new Otp({ email: req.params.email, createOtp });
    await otpEntry.save();
    
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.email_user,
            pass: process.env.email_password
        },
    });

    const mailOptions = {
        from: process.env.email_user,
        to: [req.params.email,

        ],
        subject: "hi this is test process",
        text: 'This is a test for otp.', 
        html: `<p>verification code is <b>${createOtp}</b> </p>`
    }

    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            return console.log("error occur",error)
        }
    })
    res.status(200).json({message:"send otp successfully"})
} catch (error) {
    res.status(500).json({message:error.message})
}
}