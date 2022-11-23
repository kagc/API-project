const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { getMaxListeners } = require("../../app");
const { route } = require("./users");

const router = express.Router();

// Edit a booking
router.put('/:bookingId', requireAuth, async (req, res, next) => {
    let { bookingId } = req.params
    let { startDate, endDate } = req.body

    let newEndDate = Date.parse(endDate)
    let newStartDate = Date.parse(startDate)

    if(newEndDate <= newStartDate){
        return res.status(400).json({
            message: "Validation error",
            statusCode: 400,
            errors: {
              endDate: "endDate cannot come before startDate"
            }
          })
    }

    const booking = await Booking.findByPk(bookingId)

    if(!booking){
        return res.status(404).json({
            message: "Booking couldn't be found",
            statusCode: 404
          })
    }

    if(booking.userId !== req.user.id){
        res.status(403).json({
            message: "Unauthorized user",
            statusCode: 403
          })
    }

    if(booking.endDate <= new Date()){
        return res.status(403).json({
            message: "Past bookings can't be modified",
            statusCode: 404
          })
    }

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

    const updated = await booking.update({
        startDate,
        endDate
    })

    return res.status(200).json(updated)
})


module.exports = router;