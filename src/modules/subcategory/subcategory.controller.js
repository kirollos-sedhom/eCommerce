import { asyncHandler } from "../../utils/asyncHandler.js";
import { Category } from "../../../DB/models/category.model.js";
import cloudinary from "../../utils/cloud.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";
import slugify from "slugify";

// create subcategory
export const createSubcategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const categoryId = req.params.categoryId;
  // check file
  if (!req.file) return next(new Error("image is required", { cause: 404 }));
  // check category
  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new Error("category not found", { cause: 404 }));
  }

  // upload file
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.FOLDER_CLOUD_NAME}\subcategory` }
  );

  // save in database
  const subcategory = await Subcategory.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
    image: { id: public_id, url: secure_url },
    categoryId: categoryId,
  });
  return res.json({
    success: true,
    message: "created subcategory",
    subcategory,
  });
});

// update subcategory
export const updateSubCategory = asyncHandler(async (req, res, next) => {
  // check category
  const category = await Category.findById(req.params.categoryId);
  if (!category)
    return next(
      new Error("this subcategory doesn't have a parent category", {
        cause: 404,
      })
    );
  //  old check subcategory
  //   const subcategory = await Subcategory.findById(req.params.subcategoryId);
  //   if (!subcategory)
  //     return next(
  //       new Error("this subcategory doesn't exist", {
  //         cause: 404,
  //       })
  //     );
  // check subcategory
  const subcategory = await Subcategory.findOne({
    _id: req.params.subcategoryId,
    categoryId: req.prams.categoryId, // check
  });
  if (!subcategory)
    return next(new Error("subcategory not found", { cause: 404 }));

  // check if i am the owner of this subcategory
  if (req.user._id.toString() !== subcategory.createdBy.toString()) {
    return next(new Error("you are not authorized"));
  }
  subcategory.name = req.body.name ? req.body.name : subcategory.name;
  subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug;

  // file?
  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: subcategory.image.id,
    });
    subcategory.image.url = secure_url;
  }
  await subcategory.save();
  return res.json({
    success: true,
    message: "updated subcategory successfully",
    results: subcategory,
  });
});

export const deleteSubcategory = asyncHandler(async (req, res, next) => {
  // check category
  const category = await Category.findById(req.params.categoryId);
  if (!category)
    return next(
      new Error("this subcategory doesn't have a parent category", {
        cause: 404,
      })
    );
  //   old check subcategory
  //   const subcategory = await Subcategory.findByIdAndDelete(
  //     req.params.subcategoryId
  //   );
  // check subcategory
  const subcategory = await Subcategory.findOneAndDelete({
    _id: req.params.subcategoryId,
    categoryId: req.prams.categoryId, // check
  });
  if (!subcategory) {
    return next(
      new Error("this subcategory doesn't exist", {
        cause: 404,
      })
    );
  } else {
    // check if i am the owner of this subcategory
    if (req.user._id.toString() !== subcategory.createdBy.toString()) {
      return next(new Error("you are not authorized"));
    }
    return res.json({
      success: true,
      message: "deleted subcategory successfully",
    });
  }
});

export const allSubcategories = asyncHandler(async (req, res, next) => {
  const subcategories = await Subcategory.find().populate([
    {
      path: "categoryId",
      select: "name",
    },
    {
      path: "createdBy",
    },
  ]);
  return res.json({ success: true, results: subcategories });
});
