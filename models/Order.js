import mongoose from "mongoose";
import User from "./User.js";

const required = true;

const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required },
    products: [{ type: Schema.Types.ObjectId, ref: "product", required }],
    totalPrice: { type: Number },
    datePlaced: { type: String, default: new Date().toLocaleString() },
  },
  //   { timestamps: true }
  {
    toJSON: {
      transform: function (doc, userObj) {
        delete userObj.__v;
        return userObj;
      },
    },
  }
);

// this refers to the order to be deleted
// this.getQuery() gives us the id of the order deleted
orderSchema.pre("deleteOne", async function () {
  // console.log(this.getQuery());
  const id = this.getQuery()._id;

  const user = await User.findOne({ order: id });
  // console.log(user);

  user.order = user.order.filter((x) => x.toString() !== id.toString());

  await user.save();
});

const Order = model("order", orderSchema);

export default Order;
