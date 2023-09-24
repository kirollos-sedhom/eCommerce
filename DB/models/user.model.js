import mongoose, { Schema, model } from "mongoose";
// Schema
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 3, // Corrected option name
      max: 20, // Corrected option name
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    forgetCode: String,
    activateCode: String,
    profileImage: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dzyexzmce/image/upload/v1692989495/Ecommerce_route/user/new_user_cp20de.jpg",
      }, // needed for cloudinary
      id: {
        type: String,
        default: "Ecommerce_route/user/new_user_cp20de",
      }, // the public id that is also needed for cloudinary
    },
    coverImages: [
      {
        url: { type: String, required: true }, // needed for cloudinary
        id: {
          type: String,
          required: true,
        }, // the public id that is also needed for cloudinary
      },
    ],
  },
  { timestamps: true }
);

// Model

export const User = mongoose.models.User || model("User", userSchema); // if you already have a user model , use it. else you can use this created one
