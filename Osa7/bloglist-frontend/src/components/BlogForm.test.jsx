import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'


test('calls onSubmit with right info', async () => {
    const user = userEvent.setup()
    const addBlog = vi.fn()
    const toggleVisibility = vi.fn()



render(
    <BlogForm
      addBlog={addBlog}
      toggleVisibility={toggleVisibility}
    />
  )


  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('URL')
  const sendButton = screen.getByText('create')


  await user.type(titleInput, 'Test Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'https://test.url')


  await user.click(sendButton)

  // addBlog-funktiota kutsutaan oikeilla tiedoilla
  expect(addBlog).toHaveBeenCalledTimes(1)
  expect(addBlog).toHaveBeenCalledWith({
    title: 'Test Title',
    author: 'Test Author',
    url: 'https://test.url',
  })
})

