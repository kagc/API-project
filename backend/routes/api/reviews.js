const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, SpotImage, ReviewImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { getMaxListeners } = require("../../app");
const { route } = require("./users");

const router = express.Router();

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
            message: "Unauthorized user",
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



module.exports = router;
