const express = require("express");
const router = express.Router();

const ArticleController = require('../controllers/article');
// const checkAuth = require('../middleware/check-auth');

router.get("/", ArticleController.get_all_articles);

router.post("/", ArticleController.create_new_article);

router.get("/:articleId", ArticleController.get_article);


module.exports = router;
