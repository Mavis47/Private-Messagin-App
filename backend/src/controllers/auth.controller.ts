import {Request,Response} from 'express';
import prisma from '../db/prisma.js';
import bcryptjs from "bcryptjs";
import generateToken from '../utils/generateToken.js';

export const signup = async(req: Request,res: Response) => {
    try {
        const { fullName , username ,password , confirmPassword , gender} = req.body;

        if(!fullName || !username || !password || !confirmPassword || !gender){
            return res.status(400).json({
                error: "Please fill in all fields"
            });
        }

        const user = await prisma.user.findUnique({ where: {username} });

        if(user){
            return res.status(400).json({error: "Username already exists"
            })
        }
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password,salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl`

        const newUser = await prisma.user.create({
            data: {
                fullName,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === 'male' ? boyProfilePic : girlProfilePic,
            }
        });

        if(newUser){

            generateToken(newUser.id,res)

            res.status(201).json({
                id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,

            })
        }else{
            res.status(400).json({
                error: "Invalid user Data"
            })
        }
    }catch(error) {
        res.status(500).json({error: "Internal Server Error"})
        console.log("Error in Signup Controller",error)
    }
}

export const login = async(req: Request,res: Response) => {
    try {
        const {username,password} = req.body;
        const user = await prisma.user.findUnique({where: {username}})
        if(!user){
            return res.status(400).json({error: "Invalid Credentials"})
        }
        const isPasswordCorrect = await bcryptjs.compare(password,user.password)

        if(!isPasswordCorrect){
            return res.status(400).json({error: "Invalid Credentials"});
        }

        generateToken(user.id,res);

        res.status(200).json({
            message: "Logged-In Successfully",
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.log("Error in Login",error);
        res.status(500).json({error: "Internal Server Error"})
    }
}

export const logout = async(req: Request,res: Response) => {
    try {
        res.cookie("jwt","",{maxAge: 0})
        res.status(200).json({message: "Logged-Out Successfully"})
    } catch (error) {
        console.log("Error Logout",error);
        res.status(500).json({"Error": error})
    }
}

export const getMe = async(req: Request,res: Response) => {
    try {
        const user = await prisma.user.findUnique({where: {id: req.user.id}})
        if(!user){
            return res.status(404).json({error: "User Not Found"})
        }

        res.status(200).json({
            message: "Hey",
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.log("Error in fetching get me controller",error)
    }
}