const User = require("../models/user");

exports.role_authorizer = (permission) => {
  return (req, res, next) => {
    const userEmail = req.userData.email;
    User.find({ email: userEmail })
      .select("role")
      .exec()
      .then((user) => {
        if (user.length != 1) {
          return res.status(409).json({
            message: "Contact super-admin",
          });
        } else {
            role = user[0].role;
            if (role === permission) {
                next();
            } else {
                return res.status(401).json({
                message: "Not authorized",
                });
            }
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  };
};
