import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import { setNotification } from './notificationReducer'
import blogService from '../services/blogs'

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    user: null,
    loggedIn: false,
  },
  reducers: {
    setUserdata(state, action) {
      state.user = action.payload
      state.loggedIn = true
    },
    resetLogin(state) {
      state.username = ''
      state.password = ''
      state.user = null
      state.loggedIn = false
    },
  },
})

export const { setUserdata, resetLogin } = loginSlice.actions

export const setLogindata = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUserdata(user))
    } catch (exception) {
      dispatch(setNotification('wrong username or password', 5))
    }
  }
}

export const checkLoggeduser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      try {
        const user = JSON.parse(loggedUserJSON)
        blogService.setToken(user.token)
        dispatch(setUserdata(user))
      } catch (error) {
        console.error('Virhe JSON:n käsittelyssä:', error)
      }
    }
  }
}

export const setReset = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(resetLogin())
  }
}

export default loginSlice.reducer
