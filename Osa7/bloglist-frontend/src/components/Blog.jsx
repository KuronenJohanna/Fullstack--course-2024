import { useState } from 'react'
import PropTypes from 'prop-types'
import { addLikes } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const Blog = ({ blog, loggedin, onRemove }) => {
    const dispatch = useDispatch()

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5,
    }

    const [viewBlog, setviewBlog] = useState(false)

    const showWhenVisible = { display: viewBlog ? '' : 'none' }

    const showRemove = { display: loggedin === blog.user?.name ? '' : 'none' }

    const toggleView = () => {
        setviewBlog(!viewBlog)
    }

    const removeBlog = async () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
            onRemove(blog.id)
    }

    return (
        <div style={blogStyle}>
            <div className="blog" data-testid={blog.title}>
                <Link to={`/blogs/${blog.id}`}>
                    {blog.title} {blog.author}
                </Link>
                <button data-testid="view" onClick={toggleView}>
                    {viewBlog ? 'hide' : 'view'}{' '}
                </button>
                <div style={showWhenVisible} className="togglableContent">
                    {blog.url} <br />
                    likes <span data-testid="likes-count">{blog.likes}</span>
                    <button onClick={() => dispatch(addLikes(blog.id, blog))}>
                        like
                    </button>
                    <br />
                    {blog.user?.name || ' '} <br />
                    <button
                        data-testid="remove"
                        style={showRemove}
                        onClick={removeBlog}
                    >
                        remove
                    </button>
                </div>
            </div>
        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    loggedin: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired,
}

export default Blog
