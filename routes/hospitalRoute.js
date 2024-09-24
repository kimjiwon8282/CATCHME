const express = require("express");
const router = express.Router();
const {searchHospitals} = require("../controllers/hospitalController");
const { requireLogin } = require('../middlewares/authMiddleware');

router.route("/search-hospitals").get(requireLogin, searchHospitals)

module.exports = router;