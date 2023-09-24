import { asyncHandler } from "../utils/asyncHandler.js";

export const isAuthorized = (role) => {
  return asyncHandler(async (req, res, next) => {
    // trace
    console.log("authorizing");
    // check user
    if (role !== req.user.role)
      return next(new Error("your aren't authorized", { cause: 403 }));
    return next();
  });
};
