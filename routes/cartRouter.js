import express from "express";
import createError from "http-errors";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const cartRouter = express.Router();

//TO GET ORDER BY USER
cartRouter
  .get("/", async (req, res, next) => {
    try {
      //show only the orders of the user that is logged in
      let order = Order.find({ user: req.userId });

      //to populate and show orders
      const query = order;
      query.populate("user", "name -_id");
      query.populate("products", "name price -_id");
      order = await query.exec();
      res.send(order);
    } catch (error) {
      next(createError(500, error.message));
    }
  })

  // CREATE ORDER / ADDING TO THE CART
  .post("/", async (req, res, next) => {
    try {
      //this userId is added from checkAuth middleware after verifying token
      req.body.user = req.userId;
      //find existing product
      const findProduct = await Product.find({ $or: [...req.body] });

      // console.log(findProduct);
      if (findProduct.length !== req.body.length) {
        return next(
          createError(
            400,
            "Order failed. Product is out of stock or not in the list"
          )
        );
      }

      //to calculate the total price from the products
      let totalPrice = 0;
      findProduct.forEach((item) => {
        totalPrice += item.price;
      });

      const order = {
        user: req.userId,
        products: findProduct.map((item) => item._id),
        totalPrice: totalPrice,
      };
      // console.log(order);
      req.body.products = findProduct._id;
      const newOrder = await Order.create(order);

      // to relate the orders to the user
      const user = await User.findById(req.userId);
      user.order.push(newOrder._id);
      user.save();

      res.status(200).send(newOrder);
    } catch (error) {
      next(createError(400, error.message));
    }
  })

  // TO UPDATE AN ORDER
  .put("/:id", async (req, res, next) => {
    try {
      const findProduct = await Product.find({ $or: [...req.body] });

      // console.log(findProduct);
      if (findProduct.length !== req.body.length) {
        return next(
          createError(
            400,
            "Order failed. Product is out of stock or not in the list"
          )
        );
      }
      //to calculate the total price from the products
      let totalPrice = 0;
      findProduct.forEach((item) => {
        totalPrice += item.price;
      });

      const order = {
        user: req.userId,
        products: findProduct.map((item) => item._id),
        totalPrice: totalPrice,
      };

      let findOrderAndUpdate = await Order.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        order,
        { new: true }
      );

      if (findOrderAndUpdate) {
        return res.status(200).send({ updatedOrder: findOrderAndUpdate });
      }
      next({ status: 404, message: "Order not found" });
    } catch (error) {
      next(createError(500, error.message));
    }
  })

  // TO DELETE AN ORDER
  .delete("/:id", async (req, res, next) => {
    try {
      const deletedOne = await Order.deleteOne({ _id: req.params.id });

      if (deletedOne.deletedCount) {
        res.status(200).send({ message: "Order deleted" });
        return;
      }
      next({ status: 404, message: "Order not found" });
    } catch (error) {
      next(createError(500, error.message));
    }
  });

export default cartRouter;
