const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  created: { type: Date, default: Date.now },
  content: {
    title: String,
    body: String,
  },
  editor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Article", articleSchema);
