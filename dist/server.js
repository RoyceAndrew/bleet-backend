"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dotenv_1 = require("dotenv");
var userRouter_ts_1 = require("./router/userRouter.ts");
var cors_1 = require("cors");
var jwtMiddleware_ts_1 = require("./middleware/jwtMiddleware.ts");
var cookie_parser_1 = require("cookie-parser");
var postRouter_ts_1 = require("./router/postRouter.ts");
dotenv_1.default.config();
var app = (0, express_1.default)();
var port = process.env.PORT || 3000;
var corsOptions = {
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true
};
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use("/api/user", userRouter_ts_1.default);
app.use('/api/post', jwtMiddleware_ts_1.default, postRouter_ts_1.default);
// app.listen(port, function () {
//     console.log("Server is running on http://localhost:".concat(port));
// });
