import { Request,Response } from "express";
import prisma from "../db/prisma.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async(req: Request,res: Response) => {
    try {
        console.log(req.body);
        const {message} = req.body;
        if(!message){
            return res.status(400).json({message: "Message is required"});
        }
        const {id:recieverId} = req.params;
        const senderId = req.user.id;

        let conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId,recieverId]
                }
            }
        })
        //the very first messeage is send
        if(!conversation){
            conversation = await prisma.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId,recieverId]
                    }
                }
            })
        }

        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id
            }
        })

        if(newMessage){
            conversation = await prisma.conversation.update({
                where: {
                    id: conversation.id
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id
                        }
                    }
                }
            })
        }
        //socketio will go here
        const receiverSocketId = getReceiverSocketId(recieverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage',newMessage); //this is for personal 1 to 1 messaging in real time
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in Message",error);
        res.status(500).json({error: "Internal Server Error"})
    }
}

export const getMessages = async(req: Request,res: Response) => {
    try {
        const {id:fetchUserChatsAndId} = req.params;
        const senderId = req.user.id;
        const conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId,fetchUserChatsAndId]
                }
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        })
        res.status(200).json(conversation?.messages)
    } catch (error) {
        console.log("Error in Getting Messages", error)
        res.status(500).json({error: "Internal Server Error"})
    }
}

export const getUserForSidebar = async(req: Request,res: Response) => {
    try {
        const authUserId = req.user.id
        console.log("AuthUserId",authUserId);
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: authUserId
                }
            },
            select: {
                id: true,
                fullName: true,
                profilePic: true,
            }
        })
        res.status(200).json({users})
    } catch (error) {
        console.log("Error in getting users",error);
        res.status(500).json({error: "Internal server error"})
    }
}