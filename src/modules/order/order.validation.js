import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const createOrderSchema = Joi.object({
  address: Joi.string().min(10).required(),
  coupon: Joi.string().length(5),
  phone: Joi.string().length(11).required(),
  payment: Joi.string().valid("cash", "visa").required(),
}).required();

export const cancelOrderSchema = Joi.object({
  orderId: Joi.string().custom(isValidObjectId).required(),
}).required();
