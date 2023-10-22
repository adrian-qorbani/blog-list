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
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
}, 100000)

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("there are three blogs", async () => {
  const response = await api.get("/api/blogs");
  // logger.info(response.body)
  expect(response.body).toHaveLength(3);
});

test("the first blog post is about cardio", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].title).toBe("How to do cardio properly?");
});

afterAll(async () => {
  await mongoose.connection.close();
});
