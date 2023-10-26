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

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else {
    let counts = blogs.reduce((count, blog) => {
      count[blog.author] = (count[blog.author] || 0) + 1;
      return count;
    }, {});
    let max = Math.max(...Object.values(counts));
    let mostBlogs = Object.keys(counts).filter(
      (author) => counts[author] === max
    );
    return {
      author: mostBlogs[0],
      blogs: max,
    };
  }
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else {
    let likes = blogs.reduce((like, blog) => {
      like[blog.author] = (like[blog.author] || 0) + blog.likes;
      return like;
    }, {});
    let max = Math.max(...Object.values(likes));
    let mostLiked = Object.keys(likes).filter(
      (author) => likes[author] === max
    );
    return {
      author: mostLiked[0],
      likes: max,
    };
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
