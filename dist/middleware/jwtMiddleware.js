import jwt from "jsonwebtoken";
const jwtMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKENKEY);
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
export default jwtMiddleware;
