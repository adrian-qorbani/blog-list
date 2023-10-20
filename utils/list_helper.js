const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const dummy = (blogs) => {
  return (totalLikes = blogs[1].likes);
};

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map((blog) => blog.likes));
  const theBlog = blogs.find((blog) => blog.likes === maxLikes);
  return theBlog;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
