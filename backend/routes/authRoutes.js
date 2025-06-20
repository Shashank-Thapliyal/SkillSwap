
import express from "express";
// import { deleteUser, editProfile, loginUser, signupUser, viewProfile, changePassword } from "../controllers/userController.js";
import { signupUser, loginUser, logoutUser, getMe } from "../controllers/user/authController.js";
import authorize from "../middlewares/authorize.js"

const router = express.Router() 

router.post("/signup", signupUser );
router.post("/login", loginUser );
router.get("/me", authorize, getMe);
router.post("/logout", authorize, logoutUser);



export default router;