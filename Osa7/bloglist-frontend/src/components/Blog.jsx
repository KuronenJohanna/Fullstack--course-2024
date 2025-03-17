import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, loggedin, onRemove, onLike }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [viewBlog, setviewBlog] = useState(false)
  const [likes, setLikes] = useState(blog.likes)



  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: likes + 1 }
    try {
      const updated = await blogService.updateLikes(blog.id, updatedBlog)
      setLikes(updated.likes)
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }
  const showWhenVisible = { display: viewBlog ? '' : 'none' }

  const showRemove = { display: loggedin === blog.user?.name ? '' : 'none' };

  const toggleView = () => {
    setviewBlog(!viewBlog)
  }

  const removeBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
      onRemove(blog.id)
  }

  return (
    <div style={blogStyle}>
      <div className='blog' data-testid={blog.title}>
        {blog.title} {blog.author}
        <button data-testid="view" onClick={toggleView}>{viewBlog ? 'hide' : 'view'} </button>
        <div style={showWhenVisible} className="togglableContent">
          {blog.url} <br />
          likes <span data-testid="likes-count">{likes}</span>
          <button onClick={onLike || handleLike}>like</button><br />
          {blog.user?.name || " "} <br />
          <button data-testid="remove" style={showRemove} onClick={removeBlog}>remove</button>
        </div>
      </div>
    </div>
  )}

Blog.propTypes = {

  blog: PropTypes.object.isRequired,
  loggedin: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired

}

export default Blog