import express from "express";
import createError from "http-errors";
import { newProductValidator } from "../middleware/validators.js";
import Product from "../models/Product.js";

const productRouter = express.Router();

//TO GET ALL PRODUCTS
productRouter
  .get("/", async (req, res, next) => {
    try {
      const allProducts = await Product.find({});
      res.send(allProducts);
    } catch (error) {
      next(createError(500, error.message));
    }
  })

  //TO CREATE A PRODUCT
  .post("/", newProductValidator, async (req, res, next) => {
    try {
      const newProduct = await Product.create(req.body);

      res.status(201).send({ newProduct: newProduct });
    } catch (error) {
      next(createError(401, error.message));
    }
  })

  // TO GET A SPECIFIC PRODUCT
  .get("/:id", async (req, res, next) => {
    try {
      const findProduct = await Product.find({ _id: req.params.id });
      res.send(findProduct);
    } catch (error) {
      next(createError(500, error.message));
    }
  })

  // TO UPDATE A SPECIFIC PRODUCT
  .put("/:id", newProductValidator, async (req, res, next) => {
    try {
      let findProductAndUpdate = await Product.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        req.body,
        { new: true }
      );
      if (findProductAndUpdate) {
        return res.status(200).send({ updatedProduct: findProductAndUpdate });
      }
      next({ status: 404, message: "Product not found" });
    } catch (error) {
      next(createError(500, error.message));
    }
  })

  // TO DELETE A SPECIFIC PRODUCT
  .delete("/:id", async (req, res, next) => {
    try {
      const deletedOne = await Product.deleteOne({ _id: req.params.id });

      if (deletedOne.deletedCount) {
        res.status(200).send({ message: "One product deleted" });
      }
      next({ status: 404, message: "Product not found" });
    } catch (error) {
      next(createError(500, error.message));
    }
  });

export default productRouter;
