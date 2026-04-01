import { body } from "express-validator";

export const signupRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 chars"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 8 }).withMessage("Password min 8 chars"),
];

export const loginRules = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required"),
];
