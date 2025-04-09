"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
var jwtMiddleware = function (req, res, next) {
    var token = req.cookies.token;
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(token, process.env.TOKENKEY);
        if (typeof decoded === "string" || !decoded.id) {
            res.clearCookie("token");
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        req.body.id = decoded.id;
        res.locals.id = decoded.id;
        next();
    }
    catch (error) {
        res.clearCookie("token");
        res
            .status(401)
            .json({
            error: "Unauthorized",
            details: error instanceof Error ? error.message : "Token error",
        });
    }
};
exports.default = jwtMiddleware;
