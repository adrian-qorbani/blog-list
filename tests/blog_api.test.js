// 1st test
const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const logger = require("../utils/logger");
const api = supertest(app);
const Blog = require("../models/blog");
const bcrypt = require("bcrypt");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObject = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObject.map((blog) => blog.save());
  await Promise.all(promiseArray);
}, 10000);

// TEST: A more specific blog is viewed
test.skip("a more specific blog can be viewed", async () => {
  const blogsAtStart = await helper.blogsInDb();

  const blogToView = blogsAtStart[0];

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(resultBlog.body).toEqual(blogToView);
});

// TEST: All blogs are returned
test.skip("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

// TEST: Specific Blog is returned
test.skip("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");
  const titles = response.body.map((blog) => blog.title);
  expect(titles).toContain("How to do cardio properly?");
});

// TEST: Adding new Blog
test.skip("a valid blog can be added", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "some Finnish dude",
    url: "http://sth.sth.com",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((blog) => blog.title);
  expect(titles).toContain("async/await simplifies making async calls");
});

test.skip("blog without title is not added", async () => {
  const newBlog = {
    author: "mr. nobody",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

// TEST: Deleting a blog
test.skip("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];
  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
  const titles = blogsAtEnd.map((r) => r.title);
  expect(titles).not.toContain(blogToDelete.content);
});

// TEST: id key is valid
test.skip("id unique identifier is actually called 'id'", async () => {
  const blogsAtStart = await helper.blogsInDb();
  // const blogToIdentify = blogsAtStart[0];
  // expect(blogToIdentify.id).toBeDefined();
  blogsAtStart.map((blog) => {
    expect(blog.id).toBeDefined();
  });
});

// TEST: checking for blog's likes default value which is 0 if not given
test.skip("default likes is 0, if not given initial amount", async () => {
  // const blogsAtStart = await helper.blogsInDb();
  // blogsAtStart.map((blog) => {
  //   expect(blog.likes).toBeDefined();
  // });
  const newBlog = {
    title: "how to make friends and influence people?",
    author: "Dr. Strange",
    url: "http://some-cooler-website.com/friends-and-stuff",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  const addedBlog = await blogsAtEnd.find(
    (blog) => blog.title === "how to make friends and influence people?"
  );
  expect(addedBlog.likes).toBe(0);
});

// TEST: if title or url is missing return 400 : Bad Request
test.skip("Blog posts' title and url aren't missing.", async () => {
  const newBlog = {
    title: "how to make friends and influence people?",
    author: "Dr. Strange",
    url: "http://some-cooler-website.com/friends-and-stuff",
  };

  await api.post("/api/blogs").send(newBlog).expect(201);
});

// TEST: updating a blog likes quantity works
test.skip("Succsesfully updated a blog's likes.", async () => {
  const updatedBlog = helper.initialBlogs[0];
  const newerUpdate = { likes: 20 };

  await api.put(`/api/${updatedBlog.id}`).send(newerUpdate);

  const blogsAtEnd = await helper.blogsInDb();
  const addedBlog = await blogsAtEnd.find(
    (blog) => blog.title === helper.initialBlogs[0].title
  );
  expect(addedBlog.likes).toBe(20);
});

// User tests
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  await mongoose.connection.close();
}, 10000);
