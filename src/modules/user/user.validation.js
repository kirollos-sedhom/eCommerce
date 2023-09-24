import joi from "joi";
// register
export const registerSchema = joi
  .object({
    userName: joi.string().min(3).max(20).required(),
    // note that in joi you must put all requirements exactly like the ones in the database model, or else we will wear in the wall and people will eat our faces
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

// activate account

export const activateSchema = joi
  .object({
    activationCode: joi.string().required(),
  })
  .required();

export const loginSchema = joi
  .object({
    email: joi.string().required(),
    password: joi.string().required(),
  })
  .required();

// send forget code
export const forgetCodeSchema = joi
  .object({ email: joi.string().email().required() })
  .required();

// reset password
export const resetPasswordSchema = joi
  .object({
    forgetCode: joi.string().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();
