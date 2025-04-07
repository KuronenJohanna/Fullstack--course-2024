import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { addComments, addLikes } from '../reducers/blogReducer'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import { InputGroup } from 'react-bootstrap'

const BlogPage = () => {
    const dispatch = useDispatch()
    const padding = {
        padding: '10px',
    }
    const { id } = useParams()
    const oneBlog = useSelector((state) => state.blogs.find((a) => a.id === id))
    const [comment, setComment] = useState('')

    if (!oneBlog) {
        return <p>Loading...</p>
    }

    const handleCommentChange = (e) => {
        setComment(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(addComments(id, comment, oneBlog))
        setComment('')
    }

    return (
        <div>
            <h2 style={padding}>
                {oneBlog.title} by {oneBlog.author}
            </h2>
            <div style={padding}>
                <a href={`${oneBlog.url}`}>{oneBlog.url}</a>
                <br />
                <span data-testid="likes-count">{oneBlog.likes}</span>
                likes
                <button onClick={() => dispatch(addLikes(oneBlog.id, oneBlog))}>
                    like
                </button>
                <br />
                {oneBlog.user ? <> added by {oneBlog.user.name} </> : null}
                <br />
                <div>
                    <h3 style={padding}>comments</h3>
                    <Form onSubmit={handleSubmit}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Add Comment"
                                name="comment"
                                value={comment}
                                onChange={handleCommentChange}
                            />
                            <Button type="submit">Add comment</Button>
                        </InputGroup>
                    </Form>
                    <ul>
                        {oneBlog.comments.map((comment) => (
                            <li key={comment.id}>{comment.text}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default BlogPage
