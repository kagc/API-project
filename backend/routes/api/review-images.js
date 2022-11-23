const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { getMaxListeners } = require("../../app");
const { route } = require("./users");

const router = express.Router();

// Delete existing image for a spot
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    let { imageId } = req.params

    const reviewImg = await ReviewImage.findByPk(imageId)

    if(!reviewImg){
        return res.status(404).json({
            message: "Review Image couldn't be found",
            statusCode: 404
        })
    } 
    
    const review = await Review.findByPk(reviewImg.reviewId)

    if(review.userId !== req.user.id){
        return res.status(403).json({
            message: "Unauthorized user",
            statusCode: 403
          })
    } else {
        reviewImg.destroy()
    }
    
    return res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
      })
})


module.exports = router;