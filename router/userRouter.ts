import express from "express";
import { upBanner, loginGoogle, searchUser, follow,uploadPhoto, checkFollow,editProfile, getInfo, userRegister, userLogin, verifyEmail, checkUser, logout, check_email, changePassword, checkReset } from "../controller/userController.ts";
import jwtMiddleware from "../middleware/jwtMiddleware.ts";
import jwtReset from "../middleware/jwtReset.ts";
import { upload } from "../middleware/multer.ts";

const router: express.Router = express.Router();

router.post("/register", userRegister) ;

router.get("/follow/:folId", jwtMiddleware, checkFollow)

router.post("/login", userLogin);

router.post("/loginGoogle", loginGoogle);

router.post("/follow", jwtMiddleware, follow);

router.get("/check", jwtMiddleware, checkUser)

router.get("/find/:search", searchUser)

router.get("/verify/:token", verifyEmail)

router.post("/logout", jwtMiddleware, logout);

router.get("/check_reset/:token", jwtReset, checkReset);

router.post("/check_email", check_email);

router.patch("/upload", jwtMiddleware, upload.single("file"), uploadPhoto);

router.patch("/uploadBanner", jwtMiddleware, upload.single("file"), upBanner);

router.get("/getInfo", jwtMiddleware, getInfo)

router.post("/change_password/:token", jwtReset, changePassword);

router.patch("/edit_profile", jwtMiddleware, editProfile);

export default router;