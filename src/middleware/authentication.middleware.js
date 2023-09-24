import { asyncHandler } from "../utils/asyncHandler.js";
import pkg from "jsonwebtoken";
const jwt = pkg;
import { Token } from "../../DB/models/token.model.js";
import { User } from "../../DB/models/user.model.js";
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  // trace
  console.log("authenticationg");
  // check token exsitence and type (isvalid)
  let token = req.headers["token"];
  if (!token || !token.startsWith(process.env.BEARER_KEY))
    return next(new Error("valid token is required"));
  // check payload
  token = token.split(process.env.BEARER_KEY)[1];
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  if (!decoded) return next(new Error("invalid token"));
  // check token in DB
  const tokenDB = await Token.findOne({ token, isValid: true });
  if (!tokenDB) return next(new Error("token expired"));
  // check user existence
  const user = await User.findOne({ email: decoded.email });
  if (!user) return next(new Error("user not found"));
  // pass user
  req.user = user;
  // return next
  return next();
});
