const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, SpotImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { getMaxListeners } = require("../../app");
const { route } = require("./users");

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
    .withMessage("lat: Latitude is not valid"),
    // check("lat","lng")
    // .isLatLong()
    // .withMessage("lat/lng: Invalid coordinates"),
  check("lng")
    .exists({ checkFalsy: true })
    .withMessage("lng: Longitude is not valid"),
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

const validateReview = [
    check('review')
    .exists({ checkFalsy: true })
    .withMessage('review: Review text is required'),
    check('stars')
    .exists({ checkFalsy: true })
    .withMessage('stars: Rating is required'),
    check('stars')
    .isIn([1, 2, 3, 4, 5])
    .withMessage('stars: Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

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

  return res.json({
    Spots: spotList,
  });
});

// CREATE a review
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    let { spotId } = req.params
    let { review, stars } = req.body

    const spot = await Spot.findByPk(spotId)

    if(!spot){
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
          })
    }

    let userSpotId
    // console.log(spot)
    if(spot.ownerId === req.user.id){
        userSpotId = spotId
    } else {
        return res.status(401).json({
            message: "Unauthorized user",
            statusCode: 401
          })
    }

    const alreadyReviewed = await Review.findOne({
        where: {
            userId: req.user.id,
            spotId: spotId
        }
    })

    if(alreadyReviewed){
        return res.status(403).json({
            "message": "User already has a review for this spot",
            "statusCode": 403
          })
    }

    const newReview = await Review.create({
        userId: userSpotId,
        spotId,
        review,
        stars
    })

    return res.status(201).json(newReview)

})

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

    if(spots.ownerId !== req.user.id){
        return res.status(401).json({
            message: "Unauthorized user",
            statusCode: 401
          })
        }


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

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    let { url, preview } = req.body
    let { spotId } = req.params

    const spot = await Spot.findByPk(spotId)

    if(!spot){
        res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
          })
    }

    let userSpotId
    // console.log(spot)
    if(spot.ownerId === req.user.id){
        userSpotId = spotId
    } else {
        res.status(403).json({
            message: "Unauthorized user",
            statusCode: 403
          })
    }
    const spotImage = await SpotImage.create({
        spotId: userSpotId,
        url,
        preview
    })

        res.status(200).json({
            id: spotImage.id,
            url: spotImage.url,
            preview: spotImage.preview
        })
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

// Edit a spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    let { spotId } = req.params
    let { address, city, state, country, lat, lng, name, description, price } = req.body
    const spot = await Spot.findByPk(spotId)


    if(!spot){
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }
    
    if(spot.ownerId !== req.user.id){
        res.status(403).json({
            message: "Unauthorized user",
            statusCode: 403
          })
    } 

    const updated = await spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    return res.status(200).json(updated)
})

// DELETE an existing spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    let { spotId } = req.params

    const spot = await Spot.findByPk(spotId)

     if(!spot){
       return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }

    if(spot.ownerId !== req.user.id){
       return res.status(403).json({
            message: "Unauthorized user",
            statusCode: 403
          })
    } else {
        spot.destroy() // kabooom
    }

    return res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
      })

})



module.exports = router;
