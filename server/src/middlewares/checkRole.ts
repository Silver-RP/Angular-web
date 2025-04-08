import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  email: string;
  name?: string;
  role: string;
}

const CheckRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
       res.status(401).json({ message: "Unauthorized: No token provided" });
       return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).json({ message: "Internal Server Error: JWT_SECRET missing" });
      return ;
    }

    try {
      const decoded = jwt.verify(token, secret) as DecodedToken;

      if (!allowedRoles.includes(decoded.role)) {
        res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
        return ;
      }

      (req as any).user = decoded;

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: "Unauthorized: Token expired" });
        return ;
      }
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return ;
    }
  };
};


export default CheckRole;