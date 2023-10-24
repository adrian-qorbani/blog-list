const blogRouters = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogRouters.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogRouters.get("/:id", async (request, response, next) => {
  // NOTE: express-async-error package is used for try/catch removal/simplification
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogRouters.post("/", async (request, response, next) => {
  const body = request.body;

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid." });
  }
  const user = await User.findById(decodedToken.id);

  // const user = await User.findById(body.userId);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  });
  // NOTE: express-async-error package is used for try/catch removal/simplification
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  // response.status(201).json(savedBlog);
  response.json(savedBlog);
});

blogRouters.delete("/:id", async (request, response, next) => {
  // try {
  //   await Blog.findByIdAndRemove(request.params.id);
  //   response.status(204).end();
  // } catch (exception) {
  //   next(exception);
  // }
  //
  // NOTE: express-async-error package is used for try/catch removal/simplification
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogRouters.put("/:id", async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogRouters;
