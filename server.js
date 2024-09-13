import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import placeRouter from "./routes/placeRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import { isAuth } from "./util.js";

const app = express();

app.use(express.json());

dotenv.config();

const frontendUrl =
  "https://placesreact.netlify.app" ||
  "http:localhost:4000" ||
  "https://placeappfrontend.onrender.com";
app.use(cors({ origin: frontendUrl }));

app.get("/api/keys/google", isAuth, (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || "" });
});

app.use("/api/users", userRouter);
app.use("/api/places", placeRouter);
app.use("/api/upload", uploadRouter);

const port = process.env.PORT || 4000;
app.listen(port);

const mongoUrl = process.env.MONGODB_URI || process.env.MONGODB_URI_LOCAL;
mongoose
  .connect(mongoUrl)
  .then(() => console.log(`connection established to ${mongoUrl}`))
  .catch((err) => {
    console.log(err.message);
  });
