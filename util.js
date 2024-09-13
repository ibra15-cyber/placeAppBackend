import jwt from "jsonwebtoken";
import axios from "axios";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    "something_secret",
    { expiresIn: "30d" }
  );
};

export const isAuth = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, "something_secret", (err, decode) => {
      if (err) {
        res.send({ message: "Invalid token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.send({ message: "No token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.send({ message: "Invalid Admin token" });
  }
};

// export const getCordinatesFromAddress = async (address) => {
//   const { data } = await axios.get(
//     `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//       address
//     )}$key=${process.env.GOOGLE_API_KEY}`
//   );

//   const coordinates = data.results[0].geometry.location;

//   return coordinates;
// };

export const getCoordinatesFromAddress = async (address) => {
  const { data } = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.GOOGLE_API_KEY}`
  );

  const coordinates = data.results[0].geometry.location;
  // console.log(coordinates);

  return coordinates;
};
