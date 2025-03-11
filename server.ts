import express from "express";
import env from "dotenv";
import userRouter from "./router/userRouter.ts";
import cors from "cors";
import cookieParser from "cookie-parser";

env.config();


const app: express.Application = express();
const port: string | number = process.env.PORT || 3000;

const corsOptions = {
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true
}

app.use(cookieParser());

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/user", userRouter);

app.listen(port, (): void => {
    console.log(`Server is running on http://localhost:${port}`);
});