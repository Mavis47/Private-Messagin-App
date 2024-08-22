import express from "express";
import { protectRoutes } from "../middlewares/protectRoutes.js";
import { getMessages, getUserForSidebar, sendMessage } from "../controllers/message.controller.js";

const router  = express.Router();

router.get('/conversations',getUserForSidebar)
router.get("/:id",getMessages)
router.post("/send/:id",sendMessage);
 

export default router;