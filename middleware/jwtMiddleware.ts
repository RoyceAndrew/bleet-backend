import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const jwtMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token: string | undefined = req.cookies.token;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded: string | JwtPayload = jwt.verify(
      token,
      process.env.TOKENKEY as string
    );
    
    if (typeof decoded === "string" || !decoded.id) {
      res.clearCookie("token");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    req.body.id = decoded.id;
    res.locals.id = decoded.id;
    next();
  } catch (error) {
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
