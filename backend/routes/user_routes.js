const express = require("express");
const { authenticate } = require("../middleware/user_auth");
const { signup, login } = require("../controllers/user_controllers");
const { logger, userLogs } = require("../controllers/logs_controllers");
const { usersAverage } = require("../controllers/users_average_controller");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logger").post(authenticate, logger);
router.route("/user-logs").get(authenticate, userLogs);
router.route("/users-average").get(usersAverage);

module.exports = router;
