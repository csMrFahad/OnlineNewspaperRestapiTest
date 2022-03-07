const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");
const RoleAuthorizer = require("../middleware/role-authorizer");

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.get(
  "/editors",
  checkAuth,
  RoleAuthorizer.role_authorizer("admin"),
  UserController.get_all_editors
);

router.post(
  "/editor",
  checkAuth,
  RoleAuthorizer.role_authorizer("admin"),
  UserController.create_new_editor
);

module.exports = router;
