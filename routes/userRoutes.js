import express from "express";
import User from "../model/userModel.js";
import { generateToken } from "../util.js";
import bcrypt from "bcrypt";

const userRouter = express.Router();

//route for admin
userRouter.get("/", async (req, res) => {
  const users = await User.find();

  res.send(users);
});

userRouter.post("/signin", async (req, res) => {
  const { email } = req.body;

  let foundUser;
  try {
    foundUser = await User.findOne({ email });
    // console.log(foundUser.password);
  } catch (err) {
    console.log("user not found");
  }

  if (foundUser) {
    if (bcrypt.compareSync(req.body.password, foundUser.password)) {
      res.send({
        _id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        isAdmin: foundUser.isAdmin,
        token: generateToken(foundUser),
      });
    } else {
      console.log("password error");
    }
  } else {
    console.log("Error user does not exist");
  }
});

userRouter.post("/signup", async (req, res) => {
  let hashedPassword = bcrypt.hashSync(req.body.password, 12);

  const newUser = await new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    image: req.body.image,
    places: [],
  });

  await newUser.save();

  res.send(newUser);
});

userRouter.post("/:id", async (req, res) => {
  const userToUpdate = await User.findById(req.params.id);
  try {
    userToUpdate.name = req.body.name;
    userToUpdate.email = req.body.email;
    userToUpdate.password = req.body.password;
  } catch (err) {
    res.send(err.message);
  }

  await userToUpdate.save();

  res.send(userToUpdate);
});

//route for admin
userRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const userToDelete = await User.findById(id);

  await userToDelete.deleteOne();

  res.send("User  successfully deleted");

  const restOfUsers = await User.find();
  res.send(restOfUsers);
});
export default userRouter;
