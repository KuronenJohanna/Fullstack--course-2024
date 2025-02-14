import { vote } from '../reducers/anecdoteReducer'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'

const Anecdotes = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)
    const filter = useSelector(state => state.filter)

    const filtersorteranecdotes = sortedAnecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase()))

    const dispatch = useDispatch()

    const addVote = (id) => {
        const anecdote = anecdotes.find(a => a.id === id);
        dispatch(vote(id, anecdote))
        const name = anecdote.content
        dispatch(setNotification(`You voted "${name}"`, 5))
      }

    return (
        <>
        {filtersorteranecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => addVote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
        </>
    )
}

export default Anecdotes