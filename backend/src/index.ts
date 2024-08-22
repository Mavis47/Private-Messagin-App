import express from 'express';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import cookieParser from "cookie-parser";
import { app, server } from './socket/socket.js';
import cors from "cors";

const PORT = process.env.PORT || 5001


app.use(express.json()); //for parsing json data
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN,
    methods: ['GET','POST'],
}))
app.use(cookieParser())
app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes);

app.get("/",(req,res) => {
    res.send("Hello Chat")
})

server.listen(PORT,() => { 
    console.log("Server is running at port " + PORT)
})

//add socket io to the server(backend)
export default app;
