// 1st test
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const logger = require("../utils/logger");
const api = supertest(app);
const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "How to do cardio properly?",
    author: "Bruce Lee",
    url: "www.sth.com/cardio",
    likes: 12,
  },
  {
    title: "Why everything is your fault and why is that okay.",
    author: "Me, probably",
    url: "goodsite.com/fault",
    likes: 41,
  },
  {
    title: "We become what we think about.",
    author: "Lana Ray",
    url: "www.cooler-website.com/somesite",
    likes: 33,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[2]);
  await blogObject.save();
}, 10000);

// TEST: All blogs are returned 
test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length);
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

  const response = await api.get("/api/blogs");

  const titles = response.body.map((blog) => blog.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(titles).toContain("async/await simplifies making async calls");
});

afterAll(async () => {
  await mongoose.connection.close();
});
