import express from "express";
import { protectRoutes } from "../middlewares/protectRoutes.js";
import { getMessages, getUserForSidebar, sendMessage } from "../controllers/message.controller.js";

const router  = express.Router();

router.get('/conversations',protectRoutes,getUserForSidebar)
router.get("/:id",protectRoutes,getMessages)
router.post("/send/:id",protectRoutes,sendMessage);
 

export default router;