import mongoose from "mongoose";

const { Schema, model } = mongoose;

const required = true;
const unique = true;

const productSchema = new Schema(
  {
    name: { type: String, required, unique },
    description: { type: String, required },
    price: { type: Number, required },
  },
  {
    toJSON: {
      transform: function (doc, userObj) {
        delete userObj.__v;
        return userObj;
      },
    },
  }
);

const Product = model("product", productSchema);

export default Product;
