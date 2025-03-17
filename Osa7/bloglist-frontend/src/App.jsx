import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [errorMessage, setErrorMessage] = useState(null)
  const [noteMessage, setNoteMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)



  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)

    }
  }, [])

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => {
        const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
        setBlogs( sortedBlogs )
      })
  }, [])


  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        const updatedBlog = { ...returnedBlog, user: {
          id: user.id,
          username: user.username,
          name: user.name,
        },
         };
        setBlogs(blogs.concat(updatedBlog))
        setNoteMessage(`A new blog "${returnedBlog.title}" by "${returnedBlog.author}" added`)
        console.log("this is test", updatedBlog)
        setTimeout(() => {
          setNoteMessage(null)
        }, 5000)

      })


  }


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')

  }


  const handleRemoveBlog = async (id) => {
    try {
      await blogService.removeOne(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      console.log('Blog successfully deleted')
    } catch (error) {
      console.error('Error deleting blog', error)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification error={errorMessage} message={noteMessage}/>

        <form onSubmit={handleLogin}>
          <div>
          username
            <input
              data-testid='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
          password
            <input
              data-testid='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }




  return (
    <div>
      <h2>blogs</h2>

      <Notification message={noteMessage} />

      <p>{user.name} logged in</p>
      <button onClick={() => handleLogout()}>
      Logout
      </button>
      <Togglable buttonLabel="new blog">
        {(toggleVisibility) => (
          <BlogForm
            addBlog={addBlog}
            toggleVisibility={toggleVisibility}

          />
        )}
      </Togglable>
      <div data-testid="blogs">
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          loggedin={user.name}
          onRemove={handleRemoveBlog}
        />
      )}
      </div>



    </div>
  )

}

export default App