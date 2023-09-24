import mongoose, { Schema, Types, model } from "mongoose";

// schema
const brandSchema = new Schema(
  {
    name: { type: String, required: true }, // Mobile Phone
    slug: { type: String, required: true }, // mobile-phone (lowercase, separator) , user in SEO. we create the slug usign a lightweight package
    image: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } } // toJSON to appear in postman , toObject to appear in terminal , because terminal gets object , not json
);
brandSchema.virtual("subcategories", {
  ref: "Subcategory",
  localField: "_id", // brand model
  foreignField: "categoryId", // subcategory model
});

// model
export const Brand = mongoose.models.Brand || model("Brand", brandSchema);
