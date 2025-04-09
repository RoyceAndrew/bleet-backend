"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReset = exports.changePassword = exports.check_email = exports.logout = exports.checkUser = exports.verifyEmail = exports.userLogin = exports.userRegister = exports.getInfo = exports.editProfile = exports.upBanner = exports.uploadPhoto = void 0;
var client_1 = require("@prisma/client");
var bcrypt_1 = require("bcrypt");
var validator_1 = require("validator");
var jsonwebtoken_1 = require("jsonwebtoken");
var dotenv_1 = require("dotenv");
var nodemailer_1 = require("nodemailer");
var uuid_1 = require("uuid");
var cloudStorage_ts_1 = require("../services/cloudStorage.ts");
dotenv_1.default.config();
var saltRounds = 10;
var prisma = new client_1.PrismaClient();
var userRegister = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, username, password, token, checkError, checkEmail, checkUsername, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, username = _a.username, password = _a.password;
                token = (0, uuid_1.v4)();
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                checkError = [];
                return [4 /*yield*/, prisma.user.findUnique({ where: { email: email } })];
            case 2:
                checkEmail = _b.sent();
                if (checkEmail) {
                    checkError.push("Email already exists");
                }
                return [4 /*yield*/, prisma.user.findUnique({ where: { username: username } })];
            case 3:
                checkUsername = _b.sent();
                if (checkUsername) {
                    checkError.push("Username already exists");
                }
                if (!validator_1.default.isEmail(email)) {
                    throw Error("Invalid email");
                }
                if (username.length < 3) {
                    throw Error("Username must be at least 3 characters");
                }
                if (!validator_1.default.isStrongPassword(password)) {
                    throw Error("Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character");
                }
                if (checkError.length > 0) {
                    throw Error(checkError.join(", "));
                }
                bcrypt_1.default.hash(password, saltRounds, function (err, hash) {
                    return __awaiter(this, void 0, void 0, function () {
                        var createUser, transporter, info;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, prisma.user.create({
                                        data: {
                                            email: email,
                                            displayname: username,
                                            username: username,
                                            password: hash,
                                            isVerif: false,
                                        },
                                    })];
                                case 1:
                                    createUser = _a.sent();
                                    return [4 /*yield*/, prisma.user.update({
                                            where: { email: email },
                                            data: { token: token },
                                        })];
                                case 2:
                                    _a.sent();
                                    transporter = nodemailer_1.default.createTransport({
                                        service: "gmail",
                                        auth: {
                                            user: "bleetcorp@gmail.com",
                                            pass: process.env.PASSWORDEMAIL,
                                        },
                                    });
                                    return [4 /*yield*/, transporter.sendMail({
                                            from: '"bleetcorp@gmail.com" <bleetcorp@gmail.com>',
                                            to: email,
                                            subject: "Email Verification",
                                            html: "Please click the" +
                                                "<a href=http://localhost:5173/verify/" +
                                                token +
                                                ">" +
                                                " Click Here" +
                                                "</a>" +
                                                " to verify your account",
                                        })];
                                case 3:
                                    info = _a.sent();
                                    res.status(201).json({
                                        account: createUser,
                                        message: "Check your email to verify your account",
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                if (error_1 instanceof Error) {
                    res.status(400).json({ error: error_1.message });
                }
                else {
                    res.status(500).json({ error: "Something went wrong" });
                }
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.userRegister = userRegister;
var userLogin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, checkEmail_1, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.user.findUnique({ where: { email: email } })];
            case 2:
                checkEmail_1 = _b.sent();
                if (!checkEmail_1) {
                    throw Error("Email does not exist");
                }
                bcrypt_1.default.compare(password, checkEmail_1.password, function (err, result) {
                    if (result) {
                        if (!checkEmail_1.isVerif) {
                            res.status(400).json("Please verify your email");
                            return;
                        }
                        var token = jsonwebtoken_1.default.sign({ id: checkEmail_1.id }, process.env.TOKENKEY, { expiresIn: "3d" });
                        res.cookie("token", token, {
                            maxAge: 1000 * 60 * 60 * 24 * 3,
                            httpOnly: true,
                            secure: true,
                            sameSite: "strict",
                        });
                        res.status(200).json({ checkEmail: checkEmail_1, token: token });
                    }
                    else {
                        res.status(400).json({ error: "Incorrect password" });
                    }
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                if (error_2 instanceof Error) {
                    res.status(400).json({ error: error_2.message });
                }
                else {
                    res.status(400).json({ error: "Something went wrong" });
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.userLogin = userLogin;
var verifyEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, checkToken, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                token = req.params.token;
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { token: token },
                    })];
            case 1:
                checkToken = _a.sent();
                if (!checkToken) {
                    throw Error("Invalid token");
                }
                return [4 /*yield*/, prisma.user.update({
                        where: { token: token },
                        data: { isVerif: true, token: null },
                    })];
            case 2:
                _a.sent();
                res.status(200).json({ message: "Email verified" });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                if (error_3 instanceof Error) {
                    res.status(400).json({ error: error_3.message });
                }
                else {
                    res.status(400).json({ error: "Something went wrong" });
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.verifyEmail = verifyEmail;
var checkUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, checkUser_1, username, email, data, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.body.id;
                return [4 /*yield*/, prisma.user.findUnique({ where: { id: id } })];
            case 1:
                checkUser_1 = _a.sent();
                if (!checkUser_1) {
                    throw Error("User not found");
                }
                username = checkUser_1.username, email = checkUser_1.email, data = __rest(checkUser_1, ["username", "email"]);
                res.status(200).json({ username: username, email: email });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                if (error_4 instanceof Error) {
                    res.status(400).json({ error: error_4.message });
                }
                else {
                    res.status(400).json({ error: "Something went wrong" });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.checkUser = checkUser;
var logout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
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
        return [2 /*return*/];
    });
}); };
exports.logout = logout;
var check_email = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, token, transporter, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, prisma.user.findUnique({ where: { email: email } })];
            case 2:
                user = _a.sent();
                if (!user) return [3 /*break*/, 4];
                token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.RESETKEY, {
                    expiresIn: "1h",
                });
                transporter = nodemailer_1.default.createTransport({
                    service: "gmail",
                    auth: {
                        user: "bleetcorp@gmail.com",
                        pass: process.env.PASSWORDEMAIL,
                    },
                });
                return [4 /*yield*/, transporter.sendMail({
                        from: "bleetcorp@gmail.com",
                        to: user.email,
                        subject: "Reset password",
                        html: "Please click on the link to reset your password: <a href=\"https://localhost:5173/password_reset/".concat(token, "\">Reset password</a>"),
                    })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                res
                    .status(200)
                    .json({
                    message: "If an account with this email exists, a password reset link has been sent.",
                });
                return [3 /*break*/, 6];
            case 5:
                error_5 = _a.sent();
                if (error_5 instanceof Error) {
                    res.status(400).json({ error: error_5.message });
                }
                else {
                    res.status(400).json({ error: "Something went wrong" });
                }
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.check_email = check_email;
var changePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, password, check, compare, hash, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, id = _a.id, password = _a.password;
                if (!validator_1.default.isStrongPassword(password)) {
                    throw Error("Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character");
                }
                return [4 /*yield*/, prisma.user.findUnique({ where: { id: id } })];
            case 1:
                check = _b.sent();
                return [4 /*yield*/, bcrypt_1.default.compare(password, check === null || check === void 0 ? void 0 : check.password)];
            case 2:
                compare = _b.sent();
                if (compare) {
                    throw Error("New password must be different from old password");
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, saltRounds)];
            case 3:
                hash = _b.sent();
                return [4 /*yield*/, prisma.user.update({
                        where: { id: id },
                        data: { password: hash, passwordChangedAt: new Date() },
                    })];
            case 4:
                _b.sent();
                res.status(200).json({ message: "Password changed" });
                return [3 /*break*/, 6];
            case 5:
                error_6 = _b.sent();
                if (error_6 instanceof Error) {
                    res.status(400).json({ error: error_6.message });
                }
                else {
                    res.status(400).json({ error: "Something went wrong" });
                }
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.changePassword = changePassword;
var checkReset = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.status(200).json({ message: "Authorized" });
        return [2 /*return*/];
    });
}); };
exports.checkReset = checkReset;
var getInfo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, checkUser_2, password, passwordChangedAt, isVerif, token, data, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.body.id;
                return [4 /*yield*/, prisma.user.findUnique({ where: { id: id } })];
            case 1:
                checkUser_2 = _a.sent();
                if (!checkUser_2) {
                    throw Error("User not found");
                }
                password = checkUser_2.password, passwordChangedAt = checkUser_2.passwordChangedAt, isVerif = checkUser_2.isVerif, token = checkUser_2.token, data = __rest(checkUser_2, ["password", "passwordChangedAt", "isVerif", "token"]);
                res.status(200).json({ data: data });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                if (error_7 instanceof Error) {
                    res.status(400).json({ error: error_7.message });
                }
                else {
                    res.status(400).json({ error: "Something went wrong" });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getInfo = getInfo;
var editProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, displayname, bio, website, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, displayname = _a.displayname, bio = _a.bio, website = _a.website;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                if (bio) {
                    if (bio.length > 160) {
                        res
                            .status(400)
                            .json({ error: "Bio must be less than or equal to 160 characters" });
                        return [2 /*return*/];
                    }
                }
                if (displayname.length > 50) {
                    res
                        .status(400)
                        .json({
                        error: "Display name must be less than or equal to 50 characters",
                    });
                    return [2 /*return*/];
                }
                if (displayname.length < 3) {
                    res
                        .status(400)
                        .json({ error: "Display name must be greater than 3 characters" });
                    return [2 /*return*/];
                }
                if (website) {
                    if (!validator_1.default.isURL(website)) {
                        res.status(400).json({ error: "Invalid URL" });
                        return [2 /*return*/];
                    }
                    if (website.length > 100) {
                        res
                            .status(400)
                            .json({ error: "URL must be less than or equal to 100 characters" });
                        return [2 /*return*/];
                    }
                }
                return [4 /*yield*/, prisma.user.update({
                        where: { id: id },
                        data: { displayname: displayname, bio: bio, website: website },
                    })];
            case 2:
                _b.sent();
                res.status(200).json({ message: "Profile updated" });
                return [3 /*break*/, 4];
            case 3:
                error_8 = _b.sent();
                if (error_8 instanceof Error) {
                    res.status(400).json({ error: error_8.message });
                }
                else {
                    res.status(400).json({ error: "Something went wrong" });
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.editProfile = editProfile;
var uploadPhoto = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, file, oldImage, uploadUrl, photo, password, passwordChangedAt, isVerif, token, data, error_9;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                id = res.locals.id;
                file = req.file;
                if (!file) {
                    throw Error("No file uploaded");
                }
                return [4 /*yield*/, prisma.user.findUnique({ where: { id: id } })];
            case 1:
                oldImage = _b.sent();
                if (!((oldImage === null || oldImage === void 0 ? void 0 : oldImage.profilePicture) !==
                    "https://evardcsgulwzvbjwcokb.supabase.co/storage/v1/object/public/profilepicture//default.jpeg")) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, cloudStorage_ts_1.deleteProfile)((_a = oldImage === null || oldImage === void 0 ? void 0 : oldImage.profilePicture) === null || _a === void 0 ? void 0 : _a.split("https://evardcsgulwzvbjwcokb.supabase.co/storage/v1/object/public/profilepicture/")[1])];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: return [4 /*yield*/, (0, cloudStorage_ts_1.uploadToCloud)(file.buffer, file.mimetype, file.originalname)];
            case 4:
                uploadUrl = _b.sent();
                return [4 /*yield*/, prisma.user.update({
                        where: { id: id },
                        data: { profilePicture: uploadUrl },
                    })];
            case 5:
                photo = _b.sent();
                password = photo.password, passwordChangedAt = photo.passwordChangedAt, isVerif = photo.isVerif, token = photo.token, data = __rest(photo, ["password", "passwordChangedAt", "isVerif", "token"]);
                res.status(200).json({ data: data });
                return [3 /*break*/, 7];
            case 6:
                error_9 = _b.sent();
                if (error_9 instanceof Error) {
                    res.status(400).json({ error: error_9.message });
                }
                else {
                    res.status(400).json({ error: "Something went wrong" });
                    console.log(error_9);
                }
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.uploadPhoto = uploadPhoto;
var upBanner = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, file, oldImage, uploadUrl, photo, password, passwordChangedAt, isVerif, token, data, error_10;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                id = res.locals.id;
                file = req.file;
                if (!file) {
                    throw Error("No file uploaded");
                }
                return [4 /*yield*/, prisma.user.findUnique({ where: { id: id } })];
            case 1:
                oldImage = _b.sent();
                if (!((oldImage === null || oldImage === void 0 ? void 0 : oldImage.banner) !==
                    "https://evardcsgulwzvbjwcokb.supabase.co/storage/v1/object/public/banner//banner.jpeg")) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, cloudStorage_ts_1.deleteBanner)((_a = oldImage === null || oldImage === void 0 ? void 0 : oldImage.banner) === null || _a === void 0 ? void 0 : _a.split("https://evardcsgulwzvbjwcokb.supabase.co/storage/v1/object/public/banner/")[1])];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: return [4 /*yield*/, (0, cloudStorage_ts_1.uploadBanner)(file.buffer, file.mimetype, file.originalname)];
            case 4:
                uploadUrl = _b.sent();
                return [4 /*yield*/, prisma.user.update({
                        where: { id: id },
                        data: { banner: uploadUrl },
                    })];
            case 5:
                photo = _b.sent();
                password = photo.password, passwordChangedAt = photo.passwordChangedAt, isVerif = photo.isVerif, token = photo.token, data = __rest(photo, ["password", "passwordChangedAt", "isVerif", "token"]);
                res.status(200).json({ data: data });
                return [3 /*break*/, 7];
            case 6:
                error_10 = _b.sent();
                if (error_10 instanceof Error) {
                    res.status(400).json({ error: error_10.message });
                }
                else {
                    res.status(400).json({ error: "Something went wrong" });
                    console.log(error_10);
                }
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.upBanner = upBanner;
