const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, SpotImage, ReviewImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { getMaxListeners } = require("../../app");
const { route } = require("./users");

const router = express.Router();




module.exports = router;