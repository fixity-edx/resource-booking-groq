import { body } from "express-validator";

export const resourceRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Resource name required"),
  body("type").trim().isLength({ min: 2 }).withMessage("Type required"),
  body("location").optional().trim(),
];
