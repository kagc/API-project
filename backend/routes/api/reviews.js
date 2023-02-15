const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, SpotImage, ReviewImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
// const { getMaxListeners } = require("../../app");
const { route } = require("./users");

const router = express.Router();

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

//Get all reviews of current user
router.get('/current', requireAuth, async (req, res, next) => {
    const reviews = await Review.findAll({
        where: {
            userId: req.user.id
        },
        include: [{
            model: User
        },{
            model: Spot,
            include: {
                model: SpotImage
            }
        }, {
            model: ReviewImage
        }]
    })

    if(reviews.length === 0){
        return res.status(404).json({
            message: "No reviews found",
            statusCode: 404
          })
    }

    // if(reviews.userId !== req.user.id){
    //     return res.status(401).json({
    //         message: "Forbidden",
    //         statusCode: 401
    //       })
    //     }

    let reviewList = []
    reviews.forEach(review => {
        reviewList.push(review.toJSON())
    })

    reviewList.forEach(review => {
        delete review.User.username
        delete review.Spot.description
        delete review.Spot.createdAt
        delete review.Spot.updatedAt

        review.Spot.SpotImages.forEach(image => {
            if (image.preview === true){
                review.Spot.previewImage = image.url
            }
        })
        if (!review.Spot.previewImage){
            review.Spot.previewImage = 'No preview image found :('
        } 
        delete review.Spot.SpotImages

        review.ReviewImages.forEach(image => {
            delete image.reviewId
            delete image.createdAt
            delete image.updatedAt
        })
        
    })

    return res.status(200).json({Reviews: reviewList})
})

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    let { reviewId } = req.params
    let { url } = req.body

    const review = await Review.findByPk(reviewId)

    if(!review){
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
          })
    }

    if(review.userId !== req.user.id){
        return res.status(401).json({
            message: "Forbidden",
            statusCode: 401
          })
        }

    const allRevImgs = await ReviewImage.findAll({
        where: {
            reviewId: reviewId
        }
    })

    if(allRevImgs.length >= 10){
        return res.status(403).json({
            message: "Maximum number of images for this resource was reached",
            statusCode: 403
          })
    }

    const addImage = await ReviewImage.create({
        reviewId,
        url
    })

    return res.status(200).json({
        id: addImage.id,
        url: addImage.url
    })
})

// Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    let { reviewId } = req.params
    let { review, stars } = req.body

    const theReview = await Review.findByPk(reviewId, {
        include: [{
            model: User
        },{
            model: Spot,
            include: {
                model: SpotImage
            }
        }, {
            model: ReviewImage
        }]
    })

    if(!theReview){
        return res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
          })
    }

    if(theReview.userId !== req.user.id){
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
          })
        }

    const updatedReview = await theReview.update({
        review,
        stars
    })

    let rev = theReview.toJSON()

    rev.Spot.SpotImages.forEach(image => {
        if(image.preview === true){
            rev.Spot.previewImage = image.url
        }
    })
        if (!rev.Spot.previewImage){
            rev.Spot.previewImage = "No preview image found. :("
        }
        delete rev.Spot.SpotImages

    return res.status(200).json(rev)
})

// Delete a review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    let { reviewId } = req.params
    
    const review = await Review.findByPk(reviewId)

    if(!review){
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
          })
    }

    if(review.userId !== req.user.id){
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
          })
    } else {
       await review.destroy()
    }

    return res.status(200).json({
        id: review.id,
        message: "Successfully deleted",
        statusCode: 200
      })
})

module.exports = router;
