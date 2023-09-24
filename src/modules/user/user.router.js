import { Router } from "express";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  activateSchema,
  loginSchema,
  registerSchema,
  forgetCodeSchema,
  resetPasswordSchema,
} from "./user.validation.js";
import {
  register,
  activateAccount,
  login,
  sendForgetCode,
  resetPassword,
} from "./user.controller.js";
const router = Router();
// Register
router.post("/register", isValid(registerSchema), register);

// Activate Account
// it will be a get "/confirmEmail/:activationCode" , then of course use the validation middleware , then use the controller
router.get(
  "/confirmEmail/:activationCode",
  isValid(activateSchema),
  activateAccount
);

// Login
router.post("/login", isValid(loginSchema), login); // will take data , so must use validation

// send forget password code
router.patch("/forgetCode", isValid(forgetCodeSchema), sendForgetCode);

// Reset Password
router.patch("/resetPassword", isValid(resetPasswordSchema), resetPassword);
export default router;
