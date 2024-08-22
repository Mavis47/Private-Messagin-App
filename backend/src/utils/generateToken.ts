import { Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

const generateToken = (userId: string,res: Response) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET!,{
        expiresIn: "15d"
    })

    res.cookie("jwt",token,{
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true, //prevent XSS cross site Scripting
        sameSite: "strict", //CSRF attack cross-site request forgery
        secure: process.env.NODE_ENV !== 'development' //https
    })

    return token;
}

export default generateToken;