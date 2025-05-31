import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import env from "dotenv";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { uploadToCloud, deleteProfile, uploadBanner, deleteBanner, } from "../services/cloudStorage.js";
env.config();
const saltRounds = 10;
const prisma = new PrismaClient();
const userRegister = async (req, res) => {
    const { email, username, password } = req.body;
    const token = uuidv4();
    try {
        const checkError = [];
        const checkEmail = await prisma.user.findUnique({ where: { email } });
        if (checkEmail) {
            checkError.push("Email already exists");
        }
        const checkUsername = await prisma.user.findUnique({ where: { username } });
        if (checkUsername) {
            checkError.push("Username already exists");
        }
        if (!validator.isEmail(email)) {
            throw Error("Invalid email");
        }
        if (username.length < 3) {
            throw Error("Username must be at least 3 characters");
        }
        if (!validator.isStrongPassword(password)) {
            throw Error("Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character");
        }
        if (checkError.length > 0) {
            throw Error(checkError.join(", "));
        }
        bcrypt.hash(password, saltRounds, async function (err, hash) {
            const createUser = await prisma.user.create({
                data: {
                    email: email,
                    displayname: username,
                    username: username,
                    password: hash,
                    isVerif: false,
                },
            });
            await prisma.user.update({
                where: { email: email },
                data: { token: token },
            });
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "bleetcorp@gmail.com",
                    pass: process.env.PASSWORDEMAIL,
                },
            });
            const info = await transporter.sendMail({
                from: '"bleetcorp@gmail.com" <bleetcorp@gmail.com>',
                to: email,
                subject: "Email Verification",
                html: `Please click the 
<a href="${process.env.CLIENT_URL}/verify/${token}">
  Click Here
</a> 
to verify your account`,
            });
            res.status(201).json({
                account: createUser,
                message: "Check your email to verify your account",
            });
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Something went wrong" });
        }
    }
};
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkEmail = await prisma.user.findUnique({ where: { email } });
        if (!checkEmail) {
            throw Error("Email does not exist");
        }
        if (checkEmail.password === "google") {
            throw Error("Please login with google or register manually");
        }
        bcrypt.compare(password, checkEmail.password, function (err, result) {
            if (result) {
                if (!checkEmail.isVerif) {
                    res.status(400).json("Please verify your email");
                    return;
                }
                const token = jwt.sign({ id: checkEmail.id }, process.env.TOKENKEY, { expiresIn: "3d" });
                res.cookie("token", token, {
                    maxAge: 1000 * 60 * 60 * 24 * 3,
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                });
                res.status(200).json({ checkEmail, token });
            }
            else {
                res.status(400).json({ error: "Incorrect password" });
            }
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const checkToken = await prisma.user.findUnique({
            where: { token },
        });
        if (!checkToken) {
            throw Error("Invalid token");
        }
        await prisma.user.update({
            where: { token: token },
            data: { isVerif: true, token: null },
        });
        res.status(200).json({ message: "Email verified" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const checkUser = async (req, res) => {
    try {
        const { id } = req.body;
        const checkUser = await prisma.user.findUnique({ where: { id } });
        if (!checkUser) {
            throw Error("User not found");
        }
        const { username, email, ...data } = checkUser;
        res.status(200).json({ username, email });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const logout = async (_req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const check_email = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            const token = jwt.sign({ id: user.id }, process.env.RESETKEY, {
                expiresIn: "1h",
            });
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "bleetcorp@gmail.com",
                    pass: process.env.PASSWORDEMAIL,
                },
            });
            await transporter.sendMail({
                from: "bleetcorp@gmail.com",
                to: user.email,
                subject: "Reset password",
                html: `Please click on the link to reset your password: <a href="${process.env.CLIENT_URL}/password_reset/${token}">Reset password</a>`,
            });
        }
        res.status(200).json({
            message: "If an account with this email exists, a password reset link has been sent.",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const changePassword = async (req, res) => {
    try {
        const { id, password } = req.body;
        if (!validator.isStrongPassword(password)) {
            throw Error("Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character");
        }
        const check = await prisma.user.findUnique({ where: { id } });
        const compare = await bcrypt.compare(password, check?.password);
        if (compare) {
            throw Error("New password must be different from old password");
        }
        const hash = await bcrypt.hash(password, saltRounds);
        await prisma.user.update({
            where: { id },
            data: { password: hash, passwordChangedAt: new Date() },
        });
        res.status(200).json({ message: "Password changed" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const checkReset = async (req, res) => {
    res.status(200).json({ message: "Authorized" });
};
const getInfo = async (req, res) => {
    try {
        const { id } = req.body;
        const checkUser = await prisma.user.findUnique({ where: { id } });
        const following = await prisma.follow.findMany({ where: { user_id: id } });
        const follower = await prisma.follow.findMany({
            where: { following_id: id },
        });
        if (!checkUser) {
            throw Error("User not found");
        }
        const { password, passwordChangedAt, isVerif, token, ...data } = checkUser;
        res.status(200).json({ data, following, follower });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const editProfile = async (req, res) => {
    const { id, displayname, bio, website } = req.body;
    try {
        if (bio) {
            if (bio.length > 160) {
                res
                    .status(400)
                    .json({ error: "Bio must be less than or equal to 160 characters" });
                return;
            }
        }
        if (displayname.length > 50) {
            res.status(400).json({
                error: "Display name must be less than or equal to 50 characters",
            });
            return;
        }
        if (displayname.length < 3) {
            res
                .status(400)
                .json({ error: "Display name must be greater than 3 characters" });
            return;
        }
        if (website) {
            if (!validator.isURL(website)) {
                res.status(400).json({ error: "Invalid URL" });
                return;
            }
            if (website.length > 100) {
                res
                    .status(400)
                    .json({ error: "URL must be less than or equal to 100 characters" });
                return;
            }
        }
        await prisma.user.update({
            where: { id },
            data: { displayname, bio, website },
        });
        res.status(200).json({ message: "Profile updated" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const uploadPhoto = async (req, res) => {
    try {
        const { id } = res.locals;
        const file = req.file;
        if (!file) {
            throw Error("No file uploaded");
        }
        const oldImage = await prisma.user.findUnique({ where: { id } });
        if (oldImage?.profilePicture !==
            "https://evardcsgulwzvbjwcokb.supabase.co/storage/v1/object/public/profilepicture//default.jpeg") {
            await deleteProfile(oldImage?.profilePicture?.split("https://evardcsgulwzvbjwcokb.supabase.co/storage/v1/object/public/profilepicture/")[1]);
        }
        const uploadUrl = await uploadToCloud(file.buffer, file.mimetype, file.originalname);
        const photo = await prisma.user.update({
            where: { id },
            data: { profilePicture: uploadUrl },
        });
        const { password, passwordChangedAt, isVerif, token, ...data } = photo;
        res.status(200).json({ data });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
            console.log(error);
        }
    }
};
const upBanner = async (req, res) => {
    try {
        const { id } = res.locals;
        const file = req.file;
        if (!file) {
            throw Error("No file uploaded");
        }
        const oldImage = await prisma.user.findUnique({ where: { id } });
        if (oldImage?.banner !==
            "https://evardcsgulwzvbjwcokb.supabase.co/storage/v1/object/public/banner//banner.jpeg") {
            await deleteBanner(oldImage?.banner?.split("https://evardcsgulwzvbjwcokb.supabase.co/storage/v1/object/public/banner/")[1]);
        }
        const uploadUrl = await uploadBanner(file.buffer, file.mimetype, file.originalname);
        const photo = await prisma.user.update({
            where: { id },
            data: { banner: uploadUrl },
        });
        const { password, passwordChangedAt, isVerif, token, ...data } = photo;
        res.status(200).json({ data });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
            console.log(error);
        }
    }
};
const searchUser = async (req, res) => {
    try {
        const { search } = req.params;
        const result = await prisma.user.findMany({
            where: { username: { contains: search, mode: "insensitive" } },
            take: 5,
        });
        res.status(200).json({ result });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const follow = async (req, res) => {
    try {
        const { id } = res.locals;
        const { following } = req.body;
        if (id === following) {
            throw Error("You cannot follow yourself");
        }
        const check = await prisma.follow.findFirst({
            where: { user_id: id, following_id: following },
        });
        if (!check) {
            await prisma.follow.create({
                data: { user_id: id, following_id: following },
            });
            res.status(200).json({ message: "Following successful" });
            return;
        }
        if (check) {
            await prisma.follow.delete({ where: { id: check.id } });
            res.status(200).json({ message: "Unfollow successful" });
            return;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: "Something went wrong" });
        }
    }
};
const checkFollow = async (req, res) => {
    try {
        const { id } = res.locals;
        const { folId } = req.params;
        const result = await prisma.follow.findFirst({
            where: { user_id: id, following_id: folId },
        });
        res.status(200).json({ result });
    }
    catch (err) {
        res.status(400).json({ error: "Something went wrong" });
    }
};
const loginGoogle = async (req, res) => {
    try {
        const { email } = req.body.user;
        const { name } = req.body.user.user_metadata;
        const checkEmail = await prisma.user.findUnique({ where: { email } });
        let username = name;
        let isUnique = false;
        while (!isUnique) {
            const checkName = await prisma.user.findUnique({ where: { username } });
            if (checkName) {
                username = name + Math.floor(Math.random() * 1000);
            }
            else {
                isUnique = true;
            }
        }
        if (checkEmail) {
            const token = jwt.sign({ id: checkEmail.id }, process.env.TOKENKEY, { expiresIn: "3d" });
            res.cookie("token", token, {
                maxAge: 1000 * 60 * 60 * 24 * 3,
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });
            res.status(200).json({ checkEmail, token });
            return;
        }
        if (!checkEmail) {
            const user = await prisma.user.create({
                data: {
                    email,
                    username: username,
                    displayname: name,
                    password: "google",
                    isVerif: true,
                },
            });
            const token = jwt.sign({ id: user.id }, process.env.TOKENKEY, {
                expiresIn: "3d",
            });
            res.cookie("token", token, {
                maxAge: 1000 * 60 * 60 * 24 * 3,
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });
            res.status(200).json({ user, token });
        }
    }
    catch (err) {
        res.status(400).json({ error: "Something went wrong" });
    }
};
export { loginGoogle, uploadPhoto, checkFollow, follow, searchUser, upBanner, editProfile, getInfo, userRegister, userLogin, verifyEmail, checkUser, logout, check_email, changePassword, checkReset, };
