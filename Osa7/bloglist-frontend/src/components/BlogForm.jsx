import { useState } from 'react';

const BlogForm = ({
  addBlog,
  toggleVisibility
}) => {

  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
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
    setNewBlog({ title: '', author: '', url: '' });
  }



  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            data-testid='title'
            type="text"
            value={newBlog.title}
            name="title"
            onChange={handleBlogChange}
            placeholder="Title"
          />
        </div>
        <div>
          author:
          <input
            data-testid='author'
            type="text"
            value={newBlog.author}
            name="author"
            onChange={handleBlogChange}
            placeholder="Author"
          />
        </div>

        <div>
          url:
          <input
          data-testid='url'
            type="text"
            value={newBlog.url}
            name="url"
            onChange={handleBlogChange}
            placeholder="URL"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm