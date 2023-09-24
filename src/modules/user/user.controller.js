import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../../DB/models/user.model.js";
import { Token } from "../../../DB/models/token.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../../utils/sendEmail.js";
import { resetPasswordTemp, signUpTemp } from "../../utils/generateHTML.js";
import Randomstring from "randomstring";
import pkg from "jsonwebtoken";
import { Cart } from "../../../DB/models/cart.model.js";
const jwt = pkg;
// register
export const register = asyncHandler(async (req, res, next) => {
  // trace
  console.log(`im registering`);
  // get data from request
  const { userName, email, password } = req.body;
  // check user existence
  const isUser = await User.findOne({ email }); // must be an object
  if (isUser)
    return next(new Error("email already registered", { cause: 409 }));
  // hash the password
  const hashPassword = bcryptjs.hashSync(
    password,
    Number(process.env.SALT_ROUND)
  );
  // generate activation code
  const activationCode = crypto.randomBytes(64).toString("hex"); // generates a random code

  // create the user
  const user = await User.create({
    userName,
    email,
    password: hashPassword,
    activateCode: activationCode,
  });
  // create the confirmationLink
  const link = `http://localhost:3000/auth/confirmEmail/${activationCode}`; // i currently use localhost but later i will have my own domain
  // send email
  const isSent = await sendEmail({
    to: email,
    subject: "Activate Account",
    html: signUpTemp(link), // html content of email
  });
  // send response

  return isSent
    ? res.json({
        success: true,
        message: "activation email sent! please review your email.",
      })
    : next(new Error("something went wrong with sending an emaill"));
});

// activating the account
export const activateAccount = asyncHandler(async (req, res, next) => {
  // find user , delete the activation code, update the isConfirmed
  console.log(req.params.activationCode);

  const user = await User.findOneAndUpdate(
    {
      activateCode: req.params.activationCode,
    },
    { isConfirmed: true, $unset: { activationCode: 1 } } // find the user with the certain activation code , and delete the activation code
  );
  // check if the user doesn't exist
  if (!user) return next(new Error("User not found", { cause: 404 }));
  // create a cart
  //todo
  await Cart.create({ user: user._id });
  // send response
  return res.send(
    "congratulations, your account is now activated, try to login"
  );
});

// login
export const login = asyncHandler(async (req, res, next) => {
  // needs data from request
  const { email, password } = req.body;
  // checks user existence
  const user = await User.findOne({ email: email });
  if (!user)
    return next(new Error("invalid Email or password", { cause: 400 }));
  // checks is confirmed
  if (!user.isConfirmed)
    return next(new Error("unactivated account", { cause: 400 })); // can be handled later to allow login but restrict user behavior
  // checks password
  const match = bcryptjs.compareSync(password, user.password);
  if (!match) return next(new Error("invalid password", { cause: 400 }));
  // generates the token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_KEY,
    { expiresIn: "2d" }
  );
  // saves the token in the token model
  await Token.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });
  // change user status to online and save user
  user.status = "online";
  await user.save();
  // send the response
  return res.json({ success: true, results: token });
});

// send forget code
export const sendForgetCode = asyncHandler(async (req, res, next) => {
  // check user
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new Error("couldn't find user"));

  // generate code using famous library randomstring
  const code = Randomstring.generate({
    length: 5,
    charset: "numeric",
  });

  // need to store the code in db
  user.forgetCode = code;
  await user.save();

  // send email
  return (await sendEmail({
    to: user.email,
    subject: "Reset pssword",
    html: resetPasswordTemp(code),
  }))
    ? res.json({ success: true, message: "check your email" })
    : next(new Error("something went wrong with sending a code"));
});

// reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  // check user
  let user = await User.findOne({ forgetCode: req.body.forgetCode });
  if (!user) return next(new Error("invalid code!"));
  user = await User.findOneAndUpdate(
    { email: user.email },
    { $unset: { sendForgetCode: 1 } }
  );
  user.password = bcryptjs.hashSync(
    req.body.password,
    Number(process.env.SALT_ROUND)
  );
  await user.save();

  // invalidate tokens (to remove current log in)
  const tokens = await Token.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  // send response
  return res.json({
    success: true,
    message: "now you can login with your new password :D",
  });
});
