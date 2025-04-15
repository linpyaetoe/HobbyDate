import jwt from "jsonwebtoken";
import { prisma } from "../index.js";

export const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  console.log('Auth middleware - token:', token ? 'Token exists' : 'No token');
  
  if (!token) {
    console.log('Auth middleware - Authentication failed: No token provided');
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware - Token verification error:', error.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};