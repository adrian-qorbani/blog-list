const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  // whole schema is required but for testing purposes
  // only title is mandatory for time being
  title: { type: String, required: true },
  author: String,
  url: { type: String, required: true },
  // likes: Number,
  likes: { type: Number, default: 0 },
});

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
