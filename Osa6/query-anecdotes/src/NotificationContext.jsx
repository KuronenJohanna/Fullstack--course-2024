import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
    switch (action.type) {
      case "VOTE":
          return `anecdote '${action.payload.content}' voted`
      case "NEW":
          return `new anecdote, '${action.payload}' created`
      case "ERROR":
          return 'too short anecdote, must have length 5 or more'
      case "CLEAR":
          return ''
      default:
          return state
    }
  }

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notifyDispatch] = useReducer(notificationReducer, '')

    return (
      <NotificationContext.Provider value={[notification, notifyDispatch]}>
        {props.children}
      </NotificationContext.Provider>
    )
  }

export default NotificationContext