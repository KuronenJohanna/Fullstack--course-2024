import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload
        },

        removeBlog(state, action) {
            return state.filter((blog) => blog.id !== action.payload)
        },

        setLikes(state, action) {
            const id = action.payload.id

            return state.map((blog) => (blog.id !== id ? blog : action.payload))
        },
        setComments(state, action) {
            const { id, comments } = action.payload

            return state.map((blog) =>
                blog.id === id ? { ...blog, comments } : blog
            )
        },
    },
})

export const { setBlogs, removeBlog, setLikes, setComments } = blogSlice.actions

export const initializeBlogs = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll()

        dispatch(setBlogs(blogs))
    }
}

export const deleteBlogs = (id) => {
    return async (dispatch) => {
        try {
            await blogService.removeOne(id)
            dispatch(removeBlog(id))
            console.log('Blog successfully deleted')
        } catch (error) {
            console.error('Error deleting blog', error)
        }
    }
}

export const addLikes = (id, blog) => {
    return async (dispatch) => {
        const updatedBlog = { ...blog, likes: blog.likes + 1 }

        await blogService.updateLikes(id, updatedBlog)
        dispatch(setLikes(updatedBlog))
    }
}

export const addComments = (id, comment, blog) => {
    return async (dispatch) => {
        const theComment = {
            text: comment,
        }

        const savedComment = await blogService.updateComments(id, theComment)

        const commentedBlog = {
            ...blog,
            comments: savedComment.comments, // Oikea päivitetty lista
        }

        dispatch(setComments({ id, comments: commentedBlog.comments }))
    }
}

export default blogSlice.reducer
