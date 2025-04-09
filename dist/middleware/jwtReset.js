import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import env from "dotenv";
const prisma = new PrismaClient();
env.config();
const jwtReset = async (req, res, next) => {
    const token = req.params.token;
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.RESETKEY);
        if (typeof decoded === "string" || !decoded.id || !decoded.iat) {
            res.clearCookie("token");
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const check = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (check && check?.passwordChangedAt !== null) {
            if (check.passwordChangedAt >= new Date(decoded.iat * 1000)) {
                res.status(401).json({ error: "Token already been used" });
                return;
            }
        }
        req.body.id = decoded.id;
        next();
    }
    catch (error) {
        res.clearCookie("token");
        res.status(401).json({
            error: "Unauthorized",
            details: error instanceof Error ? error.message : "Token error",
        });
    }
};
export default jwtReset;
