
const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: '1234'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('login')).toBeVisible()
  })


  test('succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'testuser', '1234')

    await expect(page.getByText('Test User logged in')).toBeVisible()
  })

  test('fails with wrong credentials', async ({ page }) => {
    await loginWith(page, 'jossu', 'salaine')

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('wrong username or password')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    await expect(page.getByText('Test User logged in')).not.toBeVisible()
  })


  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', '1234');
      await createBlog(page, 'alustusblog', 'anonymous', 'www.mm.com', '4')
      await createBlog(page, 'gamerblog', 'GamerGirl', 'www.bm.com', '85')

      // Kirjaudu sisään käyttäjänä
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'playwright Blog', 'Play Wright', 'www.pw.com')
      await expect(page.getByText('playwright Blog Play Wright')).toBeVisible()
    })

    test('blog can be liked', async ({ page }) =>{

      await expect(page.getByText('A new blog "gamerblog" by "GamerGirl" added')).not.toBeVisible();
      const blogD = page.getByTestId('alustusblog');
      await blogD.getByTestId('view').click();

      const numberElement = blogD.getByTestId('likes-count');
      const initialLikes = Number(await numberElement.innerText());

      await blogD.getByRole('button', { name: 'like' }).click()

      const newNumberElement = blogD.getByTestId('likes-count');

      await newNumberElement.waitFor({ state: 'visible' });

      const newInitialLikes = Number(await newNumberElement.innerText());

      expect(newInitialLikes).toBe(initialLikes + 1);

    })

    test('blog can be deleted by user who had added it', async ({ page }) => {
      await createBlog(page, 'playwright Blog', 'Play Wright', 'www.pw.com')

      await expect(page.getByText('A new blog "playwright Blog" by "Play Wright" added')).not.toBeVisible();

      const blogD = page.getByTestId('playwright Blog');
      await blogD.getByTestId('view').click();

      page.on('dialog', async (dialog) => {

        await dialog.accept();
      });

      await blogD.getByTestId('remove').click();

      await expect(blogD).toBeHidden();
    })

    test('who added blog, sees remove button', async({page}) => {
      await createBlog(page, 'Testi Blog', 'Johanna koodari', 'www.TESTING.com')

      await expect(page.getByText('A new blog "Testi Blog" by "Johanna koodari" added')).not.toBeVisible();

      const blogD = page.getByTestId('Testi Blog');
      const removeButton = blogD.getByTestId('remove');
      await blogD.getByTestId('view').click();

      await expect(removeButton).toBeVisible();
    })

    test('testing with likes and right order', async({page}) => {
      await createBlog(page, 'Testi Blog', 'Johanna koodari', 'www.TESTING.com')
      await expect(page.getByText('A new blog "Testi Blog" by "Johanna koodari" added')).not.toBeVisible();
      const blogD = page.getByTestId('Testi Blog');

      await blogD.getByTestId('view').click();
      await blogD.getByRole('button', { name: 'like' }).click()
      await blogD.getByRole('button', { name: 'like' }).click()
      await blogD.getByRole('button', { name: 'like' }).click()

      const blogD1 = page.getByTestId('alustusblog');
      await blogD1.getByTestId('view').click();
      await blogD1.getByRole('button', { name: 'like' }).click()
      await blogD1.getByRole('button', { name: 'like' }).click()



    const blogs = await page.getByTestId('blogs');

    const likesCounts = await blogs.evaluateAll((elements) =>
      elements.map((el) => {
        const likesElement = el.querySelector('[data-testid="likes-count"]');
        return likesElement ? parseInt(likesElement.textContent.trim(), 10) : 0;
      })
    );


    const sortedLikes = [...likesCounts].sort((a, b) => b - a);
    expect(likesCounts).toEqual(sortedLikes);


    })


  })
})
// tehtävä 5.22
