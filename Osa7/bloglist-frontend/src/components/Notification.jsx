import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const { notification, visible } = useSelector((state) => state.notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
  }

  return (
    visible && (
      <div style={style} name="notification">
        {notification}
      </div>
    )
  )
}

export default Notification
