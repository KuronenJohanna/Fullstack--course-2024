import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Blogs from './components/Blogs'
import { useDispatch, useSelector } from 'react-redux'
import Users from './components/users'
import UserPage from './components/UserPage'
import BlogPage from './components/BlogPage'
import { initializeBlogs } from './reducers/blogReducer'
import {
    checkLoggeduser,
    setLogindata,
    setReset,
} from './reducers/loginReducer'
import { initializeUsers } from './reducers/usersReducer'
import { Routes, Route, Link } from 'react-router-dom'
import { Navbar, Nav, Form, Button } from 'react-bootstrap'

const App = () => {
    const padding = {
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
    }
    const dispatch = useDispatch()
    const user = useSelector((state) => state.login.user)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        dispatch(checkLoggeduser())
    }, [dispatch])

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [dispatch])

    useEffect(() => {
        dispatch(initializeUsers())
    }, [dispatch])

    const handleLogin = async (event) => {
        event.preventDefault()

        dispatch(setLogindata(username, password))

        setUsername('')
        setPassword('')
    }

    const handleLogout = (event) => {
        dispatch(setReset())
    }

    if (user === null) {
        return (
            <div data-testid="logIn" className="container">
                <h2>Log in to application</h2>

                <Notification />

                <Form onSubmit={handleLogin}>
                    <Form.Group>
                        <Form.Label>username:</Form.Label>
                        <Form.Control
                            data-testid="username"
                            type="text"
                            value={username}
                            name="Username"
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>password:</Form.Label>
                        <Form.Control
                            data-testid="password"
                            type="password"
                            value={password}
                            name="Password"
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        login
                    </Button>
                </Form>
            </div>
        )
    }

    return (
        <div className="container">
            <header style={padding}>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#" as="span">
                                <Link to="/blogs" style={padding}>
                                    blogs
                                </Link>
                            </Nav.Link>
                            <Nav.Link href="#" as="span">
                                <Link to="/users" style={padding}>
                                    users
                                </Link>
                            </Nav.Link>
                            <Nav.Link href="#" as="span">
                                {user.name} logged in
                                <button onClick={() => handleLogout()}>
                                    Logout
                                </button>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </header>
            <h2>Blog app</h2>

            <Routes>
                <Route path="/" element={<Blogs />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserPage />} />
                <Route path="/blogs/:id" element={<BlogPage />} />
            </Routes>
        </div>
    )
}

export default App
