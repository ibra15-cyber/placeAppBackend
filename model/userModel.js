import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: "string", required: true },
    email: { type: "string", required: true, unique: true },
    password: { type: "string", required: true, minLength: 6 },
    image: { type: "string" },
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
    isAdmin: { type: "boolean", default: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
