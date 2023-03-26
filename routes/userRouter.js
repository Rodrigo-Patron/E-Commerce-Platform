import express from "express";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import User from "../models/User.js";
import { newUserValidator } from "../middleware/validators.js";

const userRouter = express.Router();

// CREATE / REGISTER A NEW USER
userRouter
  .post("/", newUserValidator, async (req, res, next) => {
    try {
      // hash the password coming from the post request
      const hashed = await hash(req.body.password, 10);
      // reassign the password with the hashed one
      req.body.password = hashed;
      // save/create the user
      const newUser = await User.create(req.body);

      res.status(201).send({ newData: newUser });
    } catch (error) {
      next(createError(401, error.message));
    }
  })

  // LOGIN
  .post("/login", async (req, res, next) => {
    try {
      //checking if email exist
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        next(createError(401, "Credential failed"));
        return;
      }
      //comparing hashed password
      const successLogin = await compare(req.body.password, user.password);
      if (!successLogin) {
        next(createError(401, "Credential failed"));
        return;
      }
      //creating token
      //aaaaaa.bbbbbbb.ccccccc
      const option = { expiresIn: "3h" };
      const token = jwt.sign({ id: user._id }, process.env.SECRET, option);

      res.send({ user, token });
    } catch (error) {
      next(createError(500, error.message));
    }
  });

export default userRouter;
