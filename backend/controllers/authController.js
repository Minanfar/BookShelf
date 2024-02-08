import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import userModel from '../models/userModel.js';

export const postSignupController = async (req, res) => { 
const JWT_SECRET="10101"
    const {email, password } = req.body;
    try {
        const saltedHashedPassword = await bcrypt.hash(password, 14);
        const newUser = new userModel({
            email, password: saltedHashedPassword
        });
        await newUser.save();
        res.status(201).send({success:true, insertedData: newUser});

    } catch (error) {
        console.error(error)
        res.status(500).send({success: false, error: error.message})
    }

  }

export const postLoginController = async (req, res) => { 

    const { email, password } = req.body;
    try {
        const loggedUser = await userModel.findOne({email: email});
        if(!loggedUser) {
            return res.status(404).send({success: false, error: 'User/Password Combination not found'});
        }
        const isCorrectPassword = await bcrypt.compare(password, loggedUser.password);
        if(!isCorrectPassword) {
            return res.status(404).send({success: false, error: 'User/Password Combination not found'})
        } 
        const expiresInMs = 5 * 60 * 1000; 
        const expiresInDate = new Date( Date.now() + expiresInMs ); 


        const token = jwt.sign(
            {userId: loggedUser._id},
           JWT_SECRET,
            {expiresIn: expiresInMs/1000} 
        );

        const cookieOptions = {
            httpOnly: true, 
             maxAge: expiresInMs
        }
        
        res.cookie('jwt', token, cookieOptions);
   
        const options = {
            maxAge: expiresInMs
        };
        const payload = {
            expires: expiresInDate.toISOString(), 
            email: loggedUser.email 
        }
        res.cookie('JWTinfo', payload, options);
        return res.send({success: true, msg: `User ${loggedUser.email} logged in`})
     
        
    } catch (error) {
        console.error(error)
        res.status(500).send({success:false, error: error.message})
    }

}

export const postLogoutController = async (req, res) => {
    res.clearCookie("jwt");
    res.clearCookie("JWTinfo");
    res.send({msg: "erfolgreich ausgeloggt"});
}


const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
  };
