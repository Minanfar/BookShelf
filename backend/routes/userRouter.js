import express from "express"
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserInfo,
} from "../controllers/userController.js";
import isAuth from "../middleware/isAuth.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { validateUser } from "../middleware/validateUser.js";


const router = express.Router();

router
  .post("/register",authenticateUser,validateUser, registerUser)
  .post("/login",isAuth, loginUser)
  .post("/logout", logoutUser)
  .get("/userinfo", getUserInfo);

 export default router;