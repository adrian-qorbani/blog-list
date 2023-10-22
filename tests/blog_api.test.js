// 1st test
const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const logger = require("../utils/logger");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  // logger.info(helper.initialBlogs)

  let blogObject = new Blog(helper.initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(helper.initialBlogs[1]);
  await blogObject.save();

  blogObject = new Blog(helper.initialBlogs[2]);
  await blogObject.save();
}, 10000);

// TEST: All blogs are returned
test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

// TEST: Specific Blog is returned
test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");
  const titles = response.body.map((blog) => blog.title);
  expect(titles).toContain("How to do cardio properly?");
});

// TEST: Adding new Blog
test("a valid blog can be added", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "some Finnish dude",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  // const response = await api.get("/api/blogs");

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((blog) => blog.title);
  expect(titles).toContain("async/await simplifies making async calls");

  // const titles = response.body.map((blog) => blog.title);

  // expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
  // expect(titles).toContain("async/await simplifies making async calls");
});

test("blog without title is not added", async () => {
  const newBlog = {
    author: "mr. nobody",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

afterAll(async () => {
  await mongoose.connection.close();
});
