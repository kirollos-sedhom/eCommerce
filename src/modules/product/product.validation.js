import Joi from "joi";
import { isValidObjectId } from "./../../middleware/validation.middleware.js";

export const createProductSchema = Joi.object()
  .required({
    name: Joi.string().required().min(2).max(20),
    description: Joi.string(),
    availableItems: Joi.number().min(1).required(),
    price: Joi.number().min(1).required(),
    discount: Joi.number().min(1).max(100),
    category: Joi.string().custom(isValidObjectId),
    subcategory: Joi.string().custom(isValidObjectId),
    brand: Joi.string().custom(isValidObjectId),
  })
  .required();

export const deleteProductSchema = Joi.object({
  productId: Joi.string().custom(isValidObjectId).required(),
}).required();
export const getSingleProductSchema = Joi.object({
  productId: Joi.string().custom(isValidObjectId).required(),
}).required();
