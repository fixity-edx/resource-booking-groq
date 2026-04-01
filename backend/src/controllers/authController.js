import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import TokenBlacklist from "../models/TokenBlacklist.js";
import { signToken } from "../utils/jwt.js";

export async function signup(req, res, next){
  try{
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if(exists){ res.status(400); throw new Error("Email already registered"); }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash, role: "user" });
    const token = signToken(user);

    res.status(201).json({ message: "Signup successful", token });
  }catch(err){ next(err); }
}

export async function login(req, res, next){
  try{
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if(!user){ res.status(401); throw new Error("Invalid credentials"); }

    const match = await bcrypt.compare(password, user.passwordHash);
    if(!match){ res.status(401); throw new Error("Invalid credentials"); }

    const token = signToken(user);
    res.json({ message: "Login successful", token });
  }catch(err){ next(err); }
}

export async function logout(req, res, next){
  try{
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if(!token) return res.json({ message: "Logged out" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await TokenBlacklist.create({ token, expiresAt: new Date(decoded.exp * 1000) });

    res.json({ message: "Logout successful" });
  }catch(err){
    res.json({ message: "Logged out" });
  }
}
