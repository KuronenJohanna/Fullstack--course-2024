import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({ addBlog, toggleVisibility }) => {
    const [newBlog, setNewBlog] = useState({
        title: '',
        author: '',
        url: '',
    })

    const handleBlogChange = (event) => {
        const { name, value } = event.target

        setNewBlog({
            ...newBlog,
            [name]: value || '',
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        addBlog(newBlog)
        toggleVisibility()
        setNewBlog({ title: '', author: '', url: '' })
    }

    return (
        <div>
            <h2>create new</h2>

            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Title:</Form.Label>
                    <Form.Control
                        data-testid="title"
                        type="text"
                        value={newBlog.title}
                        name="title"
                        onChange={handleBlogChange}
                        placeholder="Title"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Author:</Form.Label>
                    <Form.Control
                        data-testid="author"
                        type="text"
                        value={newBlog.author}
                        name="author"
                        onChange={handleBlogChange}
                        placeholder="Author"
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Url:</Form.Label>
                    <Form.Control
                        data-testid="url"
                        type="text"
                        value={newBlog.url}
                        name="url"
                        onChange={handleBlogChange}
                        placeholder="URL"
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    create
                </Button>
            </Form>
        </div>
    )
}

export default BlogForm
