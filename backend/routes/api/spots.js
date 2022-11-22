const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, SpotImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { getMaxListeners } = require("../../app");

const router = express.Router();

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

// Create a Spot
router.post("/", requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const spot = await Spot.create({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
    ownerId: req.user.id,
  });

  res.json((res.status = 201), {
    id: spot.id,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
  });
});

// Get all spots
router.get("/", async (req, res, next) => {
  let spots = await Spot.findAll({
    include: [{
        model: Review
    },{
        model: SpotImage
    }]
  });

//   spots.forEach(spot => {
//     spotReviews.push(spot.toJSON())
//   })

//   spotReviews.forEach(spot => {
//       let totalStars = 0
//     spot.Reviews.forEach(review => {
//         totalStars += review.stars
//         console.log(totalStars)
//     })
//     spots.avgRating = totalStars/spotReviews.length
//     delete spot.Reviews
//   })

  let spotList = []
  spots.forEach(spot => {
    spotList.push(spot.toJSON())
  })

  spotList.forEach(spot => {
      let totalStars = 0
    spot.Reviews.forEach(review => {
        totalStars += review.stars
    })
    spot.avgRating = totalStars/spot.Reviews.length
    delete spot.Reviews
  })

  spotList.forEach(spot => {
    spot.SpotImages.forEach(image => {
        if (image.preview === true){
            spot.previewImage = image.url
        }
    })
    if (!spot.previewImage){
        spot.previewImage = 'No preview image found :('
    }
    delete spot.SpotImages
  })

  res.json({
    Spots: spotList,
  });
});

module.exports = router;
