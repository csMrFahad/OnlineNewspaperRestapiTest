const mongoose = require("mongoose");

const Article = require("../models/article");

exports.create_new_article = (req, res, next) => {
  const article = new Article({
    _id: new mongoose.Types.ObjectId(),
    content: {
      title: req.body.content.title,
      body: req.body.content.body,
    },
    editor: req.body.editor,
  });
  article
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created article successfully",
        createdArticle: {
          content: result.content,
          _id: result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_article = (req, res, next) => {
  Article.findById(req.params.articleId)
    .populate("editor", "name _id status.active")
    .exec()
    .then((article) => {
      if (!article) {
        return res.status(404).json({
          message: "Article not found",
        });
      }
      res.status(200).json({
        article: article,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_all_articles = (req, res, next) => {
  Article.find()
    .select("content _id editor created")
    .populate("editor", "name _id status")
    .exec()
    .then((articles) => {
      res.status(200).json({
        count: articles.length,
        articles: articles.map((article) => {
          return {
            _id: article._id,
            content: article.content,
            editor: article.editor,
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
