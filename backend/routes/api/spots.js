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
    .withMessage("street: Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("city City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("state: State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("country: Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .withMessage("lat: Latitude is required"),
    check("lat", "lng")
    .isLatLong()
    .withMessage("lat/lng: Invalid coordinates"),
  check("lng")
    .exists({ checkFalsy: true })
    .withMessage("lng: Longitude is required"),
    // check("lng")
    // .isLatLong()
    // .withMessage("lng: Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("name: Name is required"),
    check("name")
    .isLength({ max: 50 })
    .withMessage("name: Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("description: Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("price: Price per day is required"),
  handleValidationErrors,
];

// Create a Spot
router.post("/", requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const spot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.json((res.status = 201), spot);
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

// GET all spots owned by current user
router.get('/current', requireAuth, async (req, res, next) => {
    // const { user } = req;
    // let currUserId
    // if (user) {
    //     currUserId = user.toSafeObject().id
    // } else return res.json({});

    let spots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        },
        include: [{
            model: Review
        },{
            model: SpotImage
        }]
    })


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
})

// GET details of spot from ID
router.get('/:spotId', async (req, res, next) => {
    let { spotId } = req.params
    const spot = await Spot.findByPk(spotId, {
        include: [{
            model: Review
        }, {
            model: SpotImage
        }, {
            model: User,
            as: 'Owner'
        }]
    })

    if(!spot){
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
          })
    }

    let pojoSpot = spot.toJSON()
    let totalStars = 0
    pojoSpot.Reviews.forEach(review => {
        totalStars += review.stars
    })
    pojoSpot.numReviews = pojoSpot.Reviews.length
    pojoSpot.avgRating = totalStars/pojoSpot.Reviews.length
    delete pojoSpot.Reviews

    pojoSpot.SpotImages.forEach(image => {
        delete image.spotId
    })

    delete pojoSpot.Owner.username

    res.json(pojoSpot);
})

module.exports = router;
