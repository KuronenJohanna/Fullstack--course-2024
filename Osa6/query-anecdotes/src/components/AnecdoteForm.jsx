import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../requests"
import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

const AnecdoteForm = () => {

  const [notification, dispatch] = useContext(NotificationContext)
  const queryClient = useQueryClient()

  const newAnecMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes']})
    },
    onError:(error) => {
      dispatch({ type: "ERROR", payload: error.response.data.error });

      setTimeout(() => {
        dispatch({ type: "CLEAR" });
      }, 5000);
    }

  })


  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''


    if (content.length < 5) {
      dispatch({ type: "ERROR" });
      setTimeout(() => {
        dispatch({ type: "CLEAR" })
      }, 5000);

      return
    }

    newAnecMutation.mutate({ content, votes: 0 })

    dispatch({ type: "NEW", payload: content })
        setTimeout(() => {
          dispatch({ type: "CLEAR" })
        }, 5000);
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
