import express from "express";
import Place from "../model/placeModel.js";
import { getCoordinatesFromAddress, isAuth } from "../util.js";

const placeRouter = express.Router();

//get all
placeRouter.get("/", async (req, res) => {
  const places = await Place.find();

  res.send(places);
});

//get place by id
placeRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const place = await Place.findById(id);

  res.send(place);
});

//get place by user id or creator
placeRouter.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  console.log(id);

  const findPlaceByCreator = await Place.find({ creator: id });
  console.log(findPlaceByCreator);

  res.send(findPlaceByCreator);
});

//create place
placeRouter.post("/", isAuth, async (req, res) => {
  const coordinates = await getCoordinatesFromAddress(req.body.address);
  const newPlace = new Place({
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    address: req.body.address,
    location: {
      lat: coordinates.lat,
      lng: coordinates.lng,
    },
    creator: req.body.creator,
    category: req.body.category,
  });

  await newPlace.save();

  res.send(newPlace);
});

//update place
placeRouter.post("/:id", async (req, res) => {
  const { id } = req.params;

  const placeToUpdate = await Place.findById(id);

  (placeToUpdate.title = req.body.title),
    (placeToUpdate.description = req.body.description),
    await placeToUpdate.save();

  res.send(placeToUpdate);
});

//delete place
placeRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const placeToDelete = await Place.findByIdAndDelete(id);

  res.send("deleted successful");
});

export default placeRouter;
