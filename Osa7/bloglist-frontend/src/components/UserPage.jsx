import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'

const UserPage = () => {
    const margin = {
        marginTop: '20px',
    }
    const { id } = useParams()
    const users = useSelector((state) => state.users)

    const oneUser = users.find((a) => a.id === id)

    if (!oneUser) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <h2 style={margin}>{oneUser.name}</h2>
            <h4 style={margin}>added blogs</h4>

            <ListGroup>
                <ul>
                    {oneUser.blogs.map((blog) => (
                        <ListGroup.Item
                            key={blog.id}
                            style={{ paddingLeft: '25px' }}
                        >
                            <li>{blog.title}</li>
                        </ListGroup.Item>
                    ))}
                </ul>
            </ListGroup>
        </div>
    )
}

export default UserPage
