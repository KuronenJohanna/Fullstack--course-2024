const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes,
  0,
)
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => (blog.likes > max.likes ? 
    {"title": blog.title,
      "author": blog.author,
      "likes": blog.likes
    }
    : max), blogs[0])
}

const mostBlogs = (blogs) => {

  const blogCountbyAuthor = blogs. reduce((count, blog) => {
    count[blog.author] = (count[blog.author] || 0) + 1;
    return count;
  }, {});

  const authorwithMostblogs = Object.keys(blogCountbyAuthor).reduce((most, author) => {
    return blogCountbyAuthor[author] > blogCountbyAuthor[most] ? author : most;
  })

  return {
    author: authorwithMostblogs,
    blogs: blogCountbyAuthor[authorwithMostblogs]
  }

}


const mostLikes = (blogs) => {

  const likeCountbyAuthor = blogs. reduce((sum, blog) => {
    sum[blog.author] =  (sum[blog.author] || 0) + blog.likes;
    return sum;
  }, {});

  const authorwithMostlikes = Object.keys(likeCountbyAuthor).reduce((most, author) => {
    return likeCountbyAuthor[author] > likeCountbyAuthor[most] ? author : most;
  })

  return {
    author: authorwithMostlikes,
    likes: likeCountbyAuthor[authorwithMostlikes]
  }


}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}