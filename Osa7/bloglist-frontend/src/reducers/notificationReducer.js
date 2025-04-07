import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notification: 'this is test',
    visible: false,
  },
  reducers: {
    showNotification(state, action) {
      state.notification = action.payload
      state.visible = true
    },
    hideNotification(state, action) {
      ;(state.notification = ''), (state.visible = false)
    },
  },
})

export const { showNotification, hideNotification } = notificationSlice.actions

export const setNotification = (message, time) => {
  return async (dispatch) => {
    dispatch(showNotification(message))

    setTimeout(() => {
      dispatch(hideNotification())
    }, time * 1000)
  }
}

export default notificationSlice.reducer
