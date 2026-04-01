import jwt from "jsonwebtoken";
import TokenBlacklist from "../models/TokenBlacklist.js";
import User from "../models/User.js";

export async function protect(req, res, next){
  try{
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if(!token){
      res.status(401);
      throw new Error("Not authorized: token missing");
    }

    const blocked = await TokenBlacklist.findOne({ token });
    if(blocked){
      res.status(401);
      throw new Error("Not authorized: token invalidated");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");
    if(!user){
      res.status(401);
      throw new Error("Not authorized: user not found");
    }

    req.user = user;
    next();
  }catch(err){
    res.status(401);
    next(err);
  }
}

export function requireRole(...roles){
  return (req, res, next) => {
    if(!req.user){
      res.status(401);
      return next(new Error("Not authorized"));
    }
    if(!roles.includes(req.user.role)){
      res.status(403);
      return next(new Error("Forbidden: insufficient role"));
    }
    next();
  };
}
