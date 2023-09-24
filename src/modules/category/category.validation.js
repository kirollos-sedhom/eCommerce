import Joi from "joi";
import { Types } from "mongoose";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

// create category schema
export const createCategorySchema = Joi.object({
  name: Joi.string().min(4).max(15).required(),
  createdBy: Joi.string().custom(isValidObjectId), // objectId
}).required();

// update category
export const updateCategorySchema = Joi.object({
  name: Joi.string().min(4).max(15),
  categoryId: Joi.string().custom(isValidObjectId),
}).required();

// delete category
export const deleteCategorySchema = Joi.object({
  categoryId: Joi.string().custom(isValidObjectId),
}).required();
// mongoose explaination
// Types.ObjectId.isValid("aegfega"); // checks if this is an actual object id
