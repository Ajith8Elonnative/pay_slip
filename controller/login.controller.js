const User = require('../model/login.model.js')
const bcrypt = require('bcrypt')
const jsonWebToken = require('jsonwebtoken') 

exports.getAll = async (req, res) => {
    try {
        const sign = await User.find()
        res.status(200).json(sign)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.signupUser = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const post = new User({
            userName,
            password: hashedPassword
        })
        const saveAuth = await post.save()
        res.status(201).json(saveAuth)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.verifyToken = (req, res, next)=>{
    const token = req.headers.authorization;
    if(!token){
        return res.status(404).json("request denied")
    }
    try {
        const verifed = jsonWebToken.verify(token, process.env.SECRET_KEY );
        
        req.User = verifed
        
        next();
    } catch (error) {
        res.status(400).json({message:"sever error"})
    }
}


exports.loginUser = async (req, res) => {
    const secret_key = process.env.SECRET_KEY
    try {
        const { userName, password } = req.body
        const existUser = await User.findOne({ userName })
        if (!existUser) {
            res.status(400).json({ message: "invalid username" })
        }
        const validPassword = await bcrypt.compare(password, existUser.password)
        if (!validPassword) {
            res.status(400).json({ message: "invalid password" })
        }
        const token = await jsonWebToken.sign({userName:existUser.userName}, secret_key,{ expiresIn: '1h' } )
        res.json({ message: "login successfully", data:token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.userVerify = async(req, res) =>{
    try {
        console.log("test")
        res.status(200).json(`welcome ${req.User.userName}`)
        
    } catch (error){
        res.status(500).json({ message: error.message })
    }
}

