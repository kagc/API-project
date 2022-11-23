const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
  User,
  Spot,
  Review,
  SpotImage,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
// const { getMaxListeners } = require("../../app");
const { route } = require("./users");

const router = express.Router();

// Get all current user's bookings
router.get("/current", requireAuth, async (req, res, next) => {
  const bookings = await Booking.findAll({
    where: {
      userId: req.user.id,
    },
    include: {
      model: Spot,
      include: {
        model: SpotImage,
      },
    },
  });

  if(bookings.length === 0){
    return res.status(404).json({
        message: "No bookings found",
        statusCode: 404
      })
}

  let bookingList = [];
  bookings.forEach((booking) => {
    bookingList.push(booking.toJSON());
  });

  bookingList.forEach((booking) => {
    booking.Spot.SpotImages.forEach((image) => {
      if (image.preview === true) {
        booking.Spot.previewImage = image.url;
      }
    });
    if (!booking.Spot.previewImage) {
      booking.Spot.previewImage = "No preview image found :(";
    }
    delete booking.Spot.SpotImages;
    delete booking.Spot.description
    delete booking.Spot.createdAt
    delete booking.Spot.updatedAt
  });

  return res.status(200).json({ Bookings: bookingList });
});

// Edit a booking
router.put("/:bookingId", requireAuth, async (req, res, next) => {
  let { bookingId } = req.params;
  let { startDate, endDate } = req.body;

  let newEndDate = Date.parse(endDate);
  let newStartDate = Date.parse(startDate);

  if (newEndDate <= newStartDate) {
    return res.status(400).json({
      message: "Validation error",
      statusCode: 400,
      errors: {
        endDate: "endDate cannot come before startDate",
      },
    });
  }

  const booking = await Booking.findByPk(bookingId);

  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found",
      statusCode: 404,
    });
  }

  if (booking.userId !== req.user.id) {
    res.status(403).json({
      message: "Forbidden",
      statusCode: 403,
    });
  }

  let sd = Date.parse(booking.startDate);
  let ed = Date.parse(booking.endDate);

  if (ed <= Date.parse(new Date())) {
    return res.status(403).json({
      message: "Past bookings can't be modified",
      statusCode: 403,
    });
  }

  if (newEndDate >= ed && newStartDate <= sd) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      statusCode: 403,
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  const updated = await booking.update({
    startDate,
    endDate,
  });

  return res.status(200).json(updated);
});

// Delete booking
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    let { bookingId } = req.params

    const booking = await Booking.findByPk(bookingId)

    if (!booking){
        return res.status(403).json({
            message: "Booking couldn't be found",
            statusCode: 404
          })
    }

    if(booking.userId !== req.user.id){
        return res.status(401).json({
                    message: "Forbidden",
                    statusCode: 401
                  })
    }

    let sd = Date.parse(booking.startDate);
    let ed = Date.parse(booking.endDate);

    if (sd <= Date.parse(new Date())) {
    return res.status(403).json({
      message: "Bookings that have been started can't be deleted",
      statusCode: 403,
    });
  } else {
    booking.destroy()
  }

  return res.status(200).json({
    message: "Successfully deleted",
    statusCode: 200
  })
})

module.exports = router;
