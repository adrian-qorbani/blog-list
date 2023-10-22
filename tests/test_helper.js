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

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
};
