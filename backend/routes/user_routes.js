const express = require("express");
const { authenticate } = require("../middleware/user_auth");
const { signup, login } = require("../controllers/user_controllers");
const { logger, userLogs } = require("../controllers/logs_controllers");
const { usersAverage } = require("../controllers/users_average_controller");
const { leaderboard } = require("../controllers/leaderboard_controller");
const {
  weeklyGoalSetter,
  weeklyGoal,
} = require("../controllers/weekly_goals_controllers");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logger").post(authenticate, logger);
router.route("/user-logs").get(authenticate, userLogs);
router.route("/users-average").get(usersAverage);
router.route("/leaderboard").get(leaderboard);
router
  .route("/weekly-goals")
  .post(authenticate, weeklyGoalSetter)
  .get(authenticate, weeklyGoal);

module.exports = router;
