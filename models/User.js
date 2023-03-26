import mongoose from "mongoose";

const required = true;
const trim = true;
const unique = true;
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required, trim, unique },
    email: { type: String, required, trim, unique },
    password: { type: String, required, trim },
    order: [{ type: Schema.Types.ObjectId, ref: "order" }],
  },
  {
    toJSON: {
      transform: function (doc, userObj) {
        delete userObj.password;
        delete userObj.__v;
        return userObj;
      },
    },
  }
);
const User = model("user", userSchema);

export default User;
