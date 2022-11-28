const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
// const { getMaxListeners } = require("../../app");
const { route } = require("./users");

const router = express.Router();

// Delete existing image for a spot
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    let { imageId } = req.params

    const spotImg = await SpotImage.findByPk(imageId)

    if(!spotImg){
        return res.status(404).json({
            message: "Spot Image couldn't be found",
            statusCode: 404
        })
    } 
    
    const spot = await Spot.findByPk(spotImg.spotId)

    if(spot.ownerId !== req.user.id){
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
          })
    } else {
       await spotImg.destroy()
    }
    
    return res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
      })
})


module.exports = router;