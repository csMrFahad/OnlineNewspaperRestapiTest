require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              name: req.body.name,
            });
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "User created",
                  result: result,
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              name: user[0].name,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_all_editors = (req, res, next) => {
  User.find({ role: "editor" })
    .select("name _id email status role")
    .exec()
    .then((users) => {
      res.status(200).json({
        count: users.length,
        users: users,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.create_new_editor = async (req, res, next) => {
  await remove_old_editor(res);
  await add_new_editor(req, res);
};

const remove_old_editor = async (res) => {
  await User.find({ role: "editor" })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return;
      }
      if (user.length == 1) {
        user[0].role = "public";
        user[0].status.active = false;
        user[0].status.end = Date.now();
        user[0].save();
      } else {
        return res.status(409).json({
          message: "Contact super-admin",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

const add_new_editor = async (req, res) => {
  await User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(409).json({
          message: "Mail does not exist",
        });
      } else if (user.length > 1) {
        return res.status(409).json({
          message: "Contact super-admin",
        });
      } else {
        user[0].role = "editor";
        user[0].status.active = true;
        user[0].status.start = Date.now();
        user[0].status.end = null;
        user[0].save();
        res.status(200).json({
          message: "Editor updated",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
