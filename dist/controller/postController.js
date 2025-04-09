"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.upComment = exports.detailPost = exports.likePost = exports.streamPost = exports.getAllPosts = exports.deletePost = exports.getProfilePost = exports.createPost = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var createPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, data, post, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, id = _a.id, data = __rest(_a, ["id"]);
                return [4 /*yield*/, prisma.post.create({ data: __assign(__assign({}, data), { user_id: id }) })];
            case 1:
                post = _b.sent();
                res.status(200).json({ post: post });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.log(error_1);
                if (error_1 instanceof Error) {
                    res.status(400).json({ error: error_1.message });
                }
                else {
                    res.status(400).json({ error: "Something went wrong" });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createPost = createPost;
var getProfilePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, post, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.body.id;
                return [4 /*yield*/, prisma.post.findMany({ where: { user_id: id }, orderBy: { created_at: "desc" }, include: { user: { select: {
                                    displayname: true,
                                    profilePicture: true,
                                    username: true
                                } }, Like: { select: { user_id: true, post_id: true } } } })];
            case 1:
                post = _a.sent();
                res.status(200).json({ post: post });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.log(error_2);
                if (error_2 instanceof Error) {
                    res.status(400).json({ error: error_2.message });
                }
                else {
                    res.status(400).json({ error: "Something went wrong" });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProfilePost = getProfilePost;
var deletePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, postId, id, post, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, postId = _a.postId, id = _a.id;
                return [4 /*yield*/, prisma.post.delete({ where: { id: postId, user_id: id } })];
            case 1:
                post = _b.sent();
                res.status(200).json({ post: post });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.log(error_3);
                if (error_3 instanceof Error) {
                    res.status(400).json({ error: error_3.message });
                }
                else {
                    res.status(400).json({ error: "Something went wrong" });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deletePost = deletePost;
var getAllPosts = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.post.findMany({ orderBy: { created_at: "desc" }, include: { user: { select: {
                                    displayname: true,
                                    profilePicture: true,
                                    username: true
                                } }, Like: { select: { user_id: true, post_id: true } } } })];
            case 1:
                post = _a.sent();
                res.status(200).json({ post: post });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.log(error_4);
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
exports.getAllPosts = getAllPosts;
var streamPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stream_1;
    return __generator(this, function (_a) {
        res.setHeader("content-type", "text/event-stream");
        res.setHeader("cache-control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        try {
            stream_1 = setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
                var post, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, prisma.post.findMany({ orderBy: { created_at: "desc" }, include: { user: { select: {
                                                displayname: true,
                                                profilePicture: true,
                                                username: true
                                            } }, Like: { select: { user_id: true, post_id: true } } } })];
                        case 1:
                            post = _a.sent();
                            if (post.length > 0) {
                                res.write("data: ".concat(JSON.stringify(post), "\n\n"));
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _a.sent();
                            if (error_5 instanceof Error) {
                                res.status(400).json({ error: error_5.message });
                            }
                            else {
                                res.status(400).json({ error: "Something went wrong" });
                            }
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); }, 5000);
            req.on("close", function () {
                clearInterval(stream_1);
            });
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
        return [2 /*return*/];
    });
}); };
exports.streamPost = streamPost;
var likePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, postId, id, result, post, result, result, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                _a = req.body, postId = _a.postId, id = _a.id;
                if (!!postId) return [3 /*break*/, 2];
                return [4 /*yield*/, prisma.like.findMany({ where: { user_id: id } })];
            case 1:
                result = _b.sent();
                res.status(200).json({ success: true, like: false, data: result });
                return [2 /*return*/];
            case 2: return [4 /*yield*/, prisma.like.findFirst({ where: { post_id: postId, user_id: id } })];
            case 3:
                post = _b.sent();
                if (!post) return [3 /*break*/, 6];
                return [4 /*yield*/, prisma.like.deleteMany({ where: { post_id: postId, user_id: id } })];
            case 4:
                _b.sent();
                return [4 /*yield*/, prisma.like.findMany({ where: { user_id: id } })];
            case 5:
                result = _b.sent();
                res.status(200).json({ success: true, like: false, data: result });
                return [2 /*return*/];
            case 6:
                if (!!post) return [3 /*break*/, 9];
                return [4 /*yield*/, prisma.like.create({ data: { post_id: postId, user_id: id } })];
            case 7:
                _b.sent();
                return [4 /*yield*/, prisma.like.findMany({ where: { user_id: id } })];
            case 8:
                result = _b.sent();
                res.status(200).json({ success: true, like: true, data: result });
                return [2 /*return*/];
            case 9: return [3 /*break*/, 11];
            case 10:
                error_6 = _b.sent();
                console.log(error_6);
                if (error_6 instanceof Error) {
                    res.status(400).json({ error: error_6.message });
                }
                else {
                    res.status(400).json({ error: "Something went wrong" });
                }
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.likePost = likePost;
var detailPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, post, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                postId = req.params.postId;
                return [4 /*yield*/, prisma.post.findUnique({ where: { id: postId }, include: { user: { select: {
                                    displayname: true,
                                    profilePicture: true,
                                    username: true
                                } }, Like: { select: { user_id: true, post_id: true } } } })];
            case 1:
                post = _a.sent();
                res.status(200).json({ post: post });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.log(error_7);
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
exports.detailPost = detailPost;
var upComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, postId, id, comment, result, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, postId = _a.postId, id = _a.id, comment = _a.comment;
                return [4 /*yield*/, prisma.post.create({ data: { reply_to: postId, user_id: id, text: comment } })];
            case 1:
                result = _b.sent();
                res.status(200).json({ result: result });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _b.sent();
                console.log(error_8);
                if (error_8 instanceof Error) {
                    res.status(400).json({ error: error_8.message });
                }
                else {
                    res.status(400).json({ error: "Something went wrong" });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.upComment = upComment;
