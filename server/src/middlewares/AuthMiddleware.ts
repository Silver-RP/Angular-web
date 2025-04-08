import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string;
  email?: string;
  name?: string;
  role?: string; 
}

interface AuthRequest extends Request {
  user?: DecodedToken;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "Internal Server Error: JWT_SECRET missing" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No valid token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret) as DecodedToken;
    req.user = decoded;

    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    // }

    next(); 
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export default authMiddleware;
