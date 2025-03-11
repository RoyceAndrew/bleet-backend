import express from "express";
import { editProfile, getInfo, userRegister, userLogin, verifyEmail, checkUser, logout, check_email, changePassword, checkReset } from "../controller/userController.ts";
import jwtMiddleware from "../middleware/jwtMiddleware.ts";
import jwtReset from "../middleware/jwtReset.ts";
import { upload } from "../middleware/multer.ts";

const router: express.Router = express.Router();

router.post("/register", userRegister) ;

router.post("/login", userLogin);

router.get("/check", jwtMiddleware, checkUser)

router.get("/verify/:token", verifyEmail)

router.post("/logout", jwtMiddleware, logout);

router.get("/check_reset/:token", jwtReset, checkReset);

router.post("/check_email", check_email);

router.post("/upload", upload.single("file"), (req, res) => {});

router.get("/getInfo", jwtMiddleware, getInfo)

router.post("/change_password/:token", jwtReset, changePassword);

router.patch("/edit_profile", jwtMiddleware, editProfile);

export default router;