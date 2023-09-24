import Joi from "joi";
import { Types } from "mongoose";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

// create brand schema
export const createbrandSchema = Joi.object({
  name: Joi.string().min(4).max(15).required(),
}).required();

// update brand
export const updatebrandSchema = Joi.object({
  name: Joi.string().min(4).max(15),
  brandId: Joi.string().custom(isValidObjectId).required(),
}).required();

// delete brand
export const deletebrandSchema = Joi.object({
  brandId: Joi.string().custom(isValidObjectId).required(),
}).required();
// mongoose explaination
// Types.ObjectId.isValid("aegfega"); // checks if this is an actual object id
