import Blog from './Blog'
import Notification from './Notification'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { deleteBlogs } from '../reducers/blogReducer'
import blogService from '../services/blogs'
import { Table } from 'react-bootstrap'

const Blogs = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.login.user)
    const blogs = useSelector((state) => state.blogs)

    const addBlog = (blogObject) => {
        blogService.create(blogObject).then((returnedBlog) => {
            const updatedBlog = {
                ...returnedBlog,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                },
            }

            blogs.concat(updatedBlog)
            dispatch(
                setNotification(
                    `A new blog "${returnedBlog.title}" by "${returnedBlog.author}" added`,
                    5
                )
            )
        })
    }

    const handleRemoveBlog = async (id) => {
        dispatch(deleteBlogs(id))
    }

    return (
        <div>
            <Notification />
            <Togglable buttonLabel="new blog">
                {(toggleVisibility) => (
                    <BlogForm
                        addBlog={addBlog}
                        toggleVisibility={toggleVisibility}
                    />
                )}
            </Togglable>

            <Table striped>
                {blogs.map((blog) => (
                    <Blog
                        key={blog.id}
                        blog={blog}
                        loggedin={user.name}
                        onRemove={handleRemoveBlog}
                    />
                ))}
            </Table>
        </div>
    )
}

export default Blogs
