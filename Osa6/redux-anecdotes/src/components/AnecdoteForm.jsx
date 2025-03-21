import { createAnecdote } from '../reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'



const NewAnecdote = () => {
    const dispatch = useDispatch()

    const makeAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        dispatch(createAnecdote(content))
        dispatch(setNotification(`You added "${content}"`, 5))
    }

    return (
        <>
        <h2>create new</h2>
        <form onSubmit={makeAnecdote}>
            <div><input name="anecdote"/></div>
            <button>create</button>
        </form>
        </>


    )
}

export default NewAnecdote