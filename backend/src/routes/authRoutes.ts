import express from "express";
import { getMe, login, logout, signup } from "../controllers/auth.controller.js";
import { protectRoutes } from "../middlewares/protectRoutes.js";

const router  = express.Router();

router.get('/getMe',protectRoutes,getMe)
router.post("/login",login)
router.post("/signup",signup)
router.post("/logout",logout) 

export default router;