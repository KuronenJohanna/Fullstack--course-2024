import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setNotification, hideNotification } from '../reducers/notificationReducer'

const Notification = () => {
  const dispatch = useDispatch();
  const { notification, visible } = useSelector(state => state.notification)



  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return visible && (
    <div style={style} name='notification'>
      {notification}
    </div>
  )
}
export default Notification