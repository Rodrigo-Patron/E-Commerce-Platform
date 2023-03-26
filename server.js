import express from "express";
import dotenv from "dotenv";
import logger from "morgan";
import createError from "http-errors";
import connectDB from "./lib/db.js";
import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";
import cartRouter from "./routes/cartRouter.js";
import checkAuth from "./middleware/checkAuth.js";

//Defining server
const server = express();

//Making env readable
dotenv.config();

//Defining the port
const port = process.env.PORT || 3000;

//Connecting to DB
connectDB();

//Middleware
server.use(express.json());
server.use(logger("dev"));

//Routes
server.use("/api/v1/products", productRouter);
server.use("/api/v1/users", userRouter);
server.use("/api/v1/cart", checkAuth, cartRouter);

//Page not found middleware
server.use((req, res, next) => {
  next(createError(404, "Page not found"));
});

//Global error handler
server.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .send({ message: err.message || "Something went wrong" });
});

//Starting the server
server.listen(port, () => {
  console.log(`Server is running on :http://localhost:${port}`);
});
