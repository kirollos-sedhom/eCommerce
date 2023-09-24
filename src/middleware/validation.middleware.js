import joi from "joi";
import { Types } from "mongoose";
export const isValid = (schema) => {
  // trace
  console.log("validating");
  // this middleware recieves the schema and validates it
  return (req, res, next) => {
    const copyReq = { ...req.body, ...req.params, ...req.query };
    const validationResult = schema.validate(copyReq, { abortEarly: false });
    if (validationResult.error) {
      const messages = validationResult.error.details.map(
        (error) => error.message
      );
      return next(new Error(messages), { cause: 400 });
    }

    return next(); // necessary to register
  };
};

export const isValidObjectId = (value, helper) => {
  // value is the value im getting in the request , helper is something that belongs to joi , so joi can throw an error if it needs to

  if (Types.ObjectId.isValid(value)) {
    return true;
  } else {
    return helper.message("invalid objectId!");
  }
};
