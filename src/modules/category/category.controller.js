import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "../../../DB/models/category.model.js";
import slugify from "slugify";
import cloudinary from "../../utils/cloud.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";
export const createCategory = asyncHandler(async (req, res, next) => {
  // file
  if (!req.file) return next(new Error("category image is required"));
  // upload using cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.FOLDER_CLOUD_NAME}/category` }
  );

  // save category in db

  const category = await Category.create({
    name: req.body.name,
    createdBy: req.user._id,
    image: { id: public_id, url: secure_url },
    slug: slugify(req.body.name),
  });

  // send response
  return res.status(201).json({ success: true, results: category });
});

// update category
export const updateCategory = asyncHandler(async (req, res, next) => {
  // check if category exists
  const category = await Category.findById(req.params.categoryId);
  if (!category) {
    return next(new Error("category not found"));
  }
  // check if i am the owner of this category
  if (req.user._id.toString() !== category.createdBy.toString()) {
    return next(new Error("you are not authorized"));
  }

  // name
  category.name = req.body.name ? req.body.name : category.name;

  // slug
  category.slug = req.body.name ? slugify(req.body.name) : category.slug;
  // files
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: category.image.id,
      }
    );
    category.image.url = secure_url; // update the new umage
  }

  // save category
  await category.save();
  // send response
  return res.status(201).json({ success: true, results: category });
});

// delete category
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const id = req.params.categoryId;
  const category = await Category.findById(id);
  if (!category) {
    return next(new Error("cant delete non existent category"));
  }
  // check if i am the owner of this category
  if (req.user._id.toString() !== category.createdBy.toString()) {
    return next(new Error("you are not authorized"));
  }

  // delete image
  const result = await cloudinary.uploader.destroy(category.image.id);
  console.log(result);

  // delete category
  await Category.findByIdAndDelete(id);

  // delete subcategories too
  await Subcategory.deleteMany({ categoryId: req.params.categoryId });
  return res.json({ success: true, message: "category deleted!" });
});

// get all categories
export const allCategory = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().populate({
    path: "subcategories",
    // select: "name -_id -categoryId", // Exclude the _id and categoryId fields
    populate: [{ path: "createdBy" }], // nested populate
  });

  return res.json({ success: true, results: categories });
});
