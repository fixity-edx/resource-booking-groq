import jwt from "jsonwebtoken";

export function signToken(user){
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
  return jwt.sign(
    { id: user._id.toString(), role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn }
  );
}
