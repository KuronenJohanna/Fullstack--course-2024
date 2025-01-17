import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from '../services/blogs'
import { test, vi } from 'vitest'

vi.mock('../services/blogs')

test('renders content', () => {
const blog = {
title: 'Component testing is done with react-testing-library',
author: 'test'
}

const { container } = render(<Blog blog={blog} />)

const div = container.querySelector('.blog')
expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
)

expect(div).toHaveTextContent(
    'test'
)
})


describe('<Blog />', () => {
  const blog = {
    title: 'Component testing with react-testing-library',
    author: 'Test Author',
    url: 'https://example.com',
    likes: 10,
    user: { id: '12345' }
}


    test('renders content after clicking the button', async () => {

      const mockUserDetails = { name: 'Test User' }
      blogService.getOne.mockResolvedValue(mockUserDetails)

      const mockHandler = vi.fn()

      const { container } = render(
        <Blog blog={blog} loggedin="Test User" onRemove={mockHandler} />
    )

        const user = userEvent.setup()


        const button = screen.getByText('view')
        await user.click(button)

        const div  = container.querySelector('.blog')

        expect(div).toHaveTextContent('https://example.com')
        expect(div).toHaveTextContent('likes 10')


        await waitFor(() => {
            expect(div).toHaveTextContent('Test User')
          })
    })

    test('clicking the like button twice, calls the handle twice', async() => {
      const mockHandler = vi.fn()

      render(
        <Blog blog={blog} onLike={mockHandler} />
      )

      const user = userEvent.setup()
      const likebutton = screen.getByText('like')
      await user.click(likebutton)
      await user.click(likebutton)

      expect(mockHandler.mock.calls).toHaveLength(2)
    })
})

