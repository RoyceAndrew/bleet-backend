import express from "express";
import env from "dotenv";
import userRouter from "./router/userRouter.js";
import cors from "cors";
import jwtMiddleware from "./middleware/jwtMiddleware.js";
import cookieParser from "cookie-parser";
import postRouter from "./router/postRouter.js";
env.config();
const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/user", userRouter);
app.use('/api/post', jwtMiddleware, postRouter);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
