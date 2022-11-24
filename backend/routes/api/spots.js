const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require('sequelize');
// const { getMaxListeners } = require("../../app");
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
router.get("/",  async (req, res, next) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query

    let errors = {}
    let errorMarker = false
   
    if(page && page < 1){
        errors.page = "Page must be greater than or equal to 1"
        errorMarker = true
    }if(page && !Number.isInteger(parseInt(page))){
        errors.page = "Page must be greater than or equal to 1"
        errorMarker = true
    } if(size && size < 1){
        errors.size = "Size must be greater than or equal to 1"
        errorMarker = true
    }if(size && !Number.isInteger(parseInt(size))){
        errors.size = "Size must be greater than or equal to 1"
        errorMarker = true 
    }if (maxLat && maxLat.indexOf('.') === -1){
        errors.maxLat = "Maximum latitude is invalid"
        errorMarker = true
    }if(maxLat && !Number.isInteger(parseInt(maxLat))){
        errors.minLat = "Maximum latitude is invalid"
        errorMarker = true 
    }if(minLat && !Number.isInteger(parseInt(minLat))){
        errors.minLat = "Minimum latitude is invalid"
        errorMarker = true 
    }if (minLat && minLat.indexOf('.') === -1){
        errors.minLat = "Minimum latitude is invalid"
        errorMarker = true
    }if (minLng && minLng.indexOf('.') === -1){
        errors.minLng = "Minimum longitude is invalid"
        errorMarker = true
    }if(minLng && !Number.isInteger(parseInt(minLng))){
        errors.minLng = "Minimum longitude is invalid"
        errorMarker = true 
    }if (maxLng && maxLng.indexOf('.') === -1){
        errors.maxLng = "Maximum longitude is invalid"
        errorMarker = true
    }if(maxLng && !Number.isInteger(parseInt(maxLng))){
        errors.maxLng = "Maximum longitude is invalid"
        errorMarker = true 
    }if(minPrice && parseInt(minPrice) <= 0){
        errors.minPrice = "Minimum price must be greater than or equal to 0"
        errorMarker = true 
    }if(minPrice && !Number.isInteger(parseInt(minPrice))){
        errors.minPrice = "Minimum price must be greater than or equal to 0"
        errorMarker = true 
    }if(maxPrice && parseInt(maxPrice) <= 0){
        errors.maxPrice = "Maximum price must be greater than or equal to 0"
        errorMarker = true 
    }if(maxPrice && !Number.isInteger(parseInt(maxPrice))){
        errors.maxPrice = "Maximum price must be greater than or equal to 0"
        errorMarker = true 
    }

    if(errorMarker === true){
        return res.status(400).json({
            message: "Validation Error",
            "statusCode": 400,
            errors
          })
    }
    
    if(!page){
        page = 1
    }
    if(page >= 10){
        page = 10
    }
    
    if(!size || size >= 20){
        size = 20
    }
    let pagination = {}

    page = parseInt(page)
    size = parseInt(size)

    if(page >= 1 && size >= 1){
        pagination.limit = size,
        pagination.offset = size*(page-1)
    }

    let where = {}
    
    if(maxLat && minLat){
        where.lat = {
            [Op.between]: [minLat, maxLat]
        }
    }
    if(maxLat && !minLat){
        where.lat = {
            [Op.lte]: maxLat
        }
    }if(minLat && !maxLat){
        where.lat = {
            [Op.gte]: minLat
        }
    }

    if(maxLng && minLng){
        where.lng = {
            [Op.between]: [minLng, maxLng]
        }
    }
    if(maxLng && !minLng){
        where.lng = {
            [Op.lte]: maxLng
        }
    }if(minLng && ! maxLat){
        where.lng = {
            [Op.gte]: minLng
        }
    }

    if(maxPrice && minPrice){
        where.price = {
            [Op.between]: [minPrice, maxPrice]
        }
    }
    if(maxPrice && !minPrice){
        where.price = {
            [Op.lte]: maxPrice
        }
    }if(minPrice && !maxPrice){
        where.price = {
            [Op.gte]: minPrice
        }
    }
console.log(where)
  let spots = await Spot.findAll({
    where,
    include: [{
        model: Review
    },{
        model: SpotImage
    }],
    ...pagination
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
    page,
    size
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

    // let userSpotId
    // console.log(spot)
    // if(spot.ownerId !== req.user.id){
    //     userSpotId = req.user.id
    // } else {
    //     return res.status(401).json({
    //         message: "Forbidden",
    //         statusCode: 401
    //       })
    // }

    const alreadyReviewed = await Review.findOne({
        where: {
            userId: req.user.id,
            spotId: spotId
        }
    })

    if(alreadyReviewed){
        return res.status(403).json({
            message: "User already has a review for this spot",
            statusCode: 403
          })
    }

    const newReview = await Review.create({
        userId: req.user.id,
        spotId,
        review,
        stars
    })

    return res.status(201).json(newReview)

})

// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    let { spotId } = req.params
    let { startDate, endDate } = req.body

    let newEndDate = Date.parse(endDate)
    let newStartDate = Date.parse(startDate)

    if(newEndDate <= newStartDate){
        return res.status(400).json({
            message: "Validation error",
            statusCode: 400,
            errors: {
              endDate: "endDate cannot be on or before startDate"
            }
          })
    }

    const spot = await Spot.findByPk(spotId)

    if(!spot){
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
          })
    }

    // if(spot.ownerId === req.user.id){
    //     return res.status(403).json({
    //         message: "Unable to book own Spot",
    //         statusCode: 403
    //     })
    // }

    const checkBookings = await Booking.findAll({
        where: {
            spotId
        }
    })

//  let allBookings = []
 checkBookings.forEach(booking => {
    let sd = Date.parse(booking.startDate)
    let ed = Date.parse(booking.endDate)
   
    if(newEndDate >= ed && newStartDate <= sd){
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            statusCode: 403,
            errors: {
              startDate: "Start date conflicts with an existing booking",
              endDate: "End date conflicts with an existing booking"
            }
          })
    } 
 })

    const newBooking = await Booking.create({
        spotId,
        userId: req.user.id,
        startDate,
        endDate
    })

    return res.status(200).json(newBooking)
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
            message: "Forbidden",
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
            message: "Forbidden",
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
            message: "Forbidden",
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

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res, next) => {
    let { spotId } = req.params

    const reviews = await Review.findAll({
        where: {
            spotId
        },
        include: [{
            model: User
        }, {
            model: ReviewImage
        }]
    })

    const spot = await Spot.findByPk(spotId)

    if(!spot){
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
          })
    }

    let reviewList = []
    reviews.forEach(review => {
        reviewList.push(review.toJSON())
    })

    reviewList.forEach(review => {
        delete review.User.username
        
        review.ReviewImages.forEach(image => {
            delete image.reviewId
            delete image.createdAt
            delete image.updatedAt
        })
    })

    return res.status(200).json({Reviews: reviewList})
})

// Get all bookings for a spot
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    let { spotId } = req.params

    const spot = await Spot.findByPk(spotId)

    if(!spot){
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
          })
    }

    const bookings = await Booking.findAll({
        where: {
            spotId
        }
    })

    if(!bookings){
        return res.status(404).json({
            message: "No bookings found",
            statusCode: 404
          })
    }

    const ownerBookings = await Booking.findAll({
        where: {
            spotId
        }, include: {
            model: User
        }
    })

    let bookingList = []
    bookings.forEach(booking => {
        bookingList.push(booking.toJSON())
    })

    bookingList.forEach(booking => {
        delete booking.userId
        delete booking.id
        delete booking.createdAt
        delete booking.updatedAt
    })

    let ownerBookingList = []
    ownerBookings.forEach(booking => {
        ownerBookingList.push(booking.toJSON())
    })

    ownerBookingList.forEach(booking => {
        delete booking.User.username
    })
    

    if(spot.ownerId === req.user.id){
        return res.status(200).json({
            Bookings: ownerBookingList
        })
    } else {
        return res.status(200).json({
            Bookings: bookingList})
    }
})

module.exports = router;
