const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)
  let token;
  let user;


  beforeEach(async () => {
    await Blog.deleteMany({})
    
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      user = new User({ username: 'root', passwordHash })
  
      await user.save()

      const loginDetails = {
        username: 'root',
        password: 'sekret'
      };

      const responseToken = await api
        .post('/api/login')
        .send(loginDetails)
      
        token = responseToken.body.token
        
        
      
  })

  describe('Editing blogs', () => {
    

    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('there are 2 blogs', async () => {
        const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
      
        assert.strictEqual(response.body.length, 2)
      })

    test('is right id', async () => {
      const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
     
      assert.ok(Object.keys(response.body[0]).includes('id'), 'Avaimista puuttuu id');

    })

    

    test("adding valid blog is succesful", async () => {

      const newBlog = {
        title: "rehun merkitys ruokinnassa",
        author: "Kana kananen",
        url: "http://www.ruok.fi",
        likes: 2,
        user: user._id
       
      }
      

      await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')


      const contents = response.body.map(r => r.title)

      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

      assert(contents.includes("rehun merkitys ruokinnassa"))

    })

    test("adding blog wihout token is not success", async() => {

      const newBlog = {
        title: "rehun merkitys ruokinnassa",
        author: "Kana kananen",
        url: "http://www.ruok.fi",
        likes: 2,
        user: user._id
      }
    
    const response = await api
        .post('/api/blogs')
        .send(newBlog) // Ei ole set-kutsua, joten tokenia ei ole
        .expect(401) // Oletetaan, että palvelin palauttaa 401 Unauthorized
      
        
        assert(response.body.error.includes('Unauthorized'))

    })
    test("blog without likes is added with default", async () => {
      const newBlog = {
        title: "there is no likes",
        author: "unpopular",
        url: "http://www.whoisthis.fi"
      }

      const postResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)


      const response = await api.get("/api/blogs")

      const addedBlog = response.body.find(blog => blog.id === postResponse.body.id);

      assert.strictEqual(addedBlog.likes, 0);

    })

    test("no title or url", async () => {
      const newBlog = {
        author: "unpopular"
        
      }

      await api
        .post("/api/blogs")
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)

    })

    test("spesific blog can be deleted", async () => {
      
      const newBlogforTest = {
        title: "kissankarvoja",
        author: "Kaikkialla",
        url: "http://www.KK.fi",
        likes: 1,
        
      }

      const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogforTest)
      .expect(201)
      .expect('Content-Type', /application\/json/)


     
      const blogsAtStart = await helper.blogsInDb()
      const blogtoDelete = response.body.id
     


      await api
        .delete(`/api/blogs/${blogtoDelete}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)


      const blogsAtEnd = await helper.blogsInDb()
      const contents = blogsAtEnd.map(r => r.title)
      assert(!contents.includes(blogtoDelete.title)) // tämä tarkistaa että juuri se tietty blogi on poistettu

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1) // ja tämä tarkistaa että määrä on vähentynyt yhdellä

    })

    test("spesific blog can be edited", async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogtoEdited = blogsAtStart[0]

      const updatedBlogData = {
        likes: blogtoEdited.likes + 10,
      };
      await api
      .put(`/api/blogs/${blogtoEdited.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedBlogData)
      .expect(200);

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(b => b.id === blogtoEdited.id);

      assert.strictEqual(updatedBlog.likes, blogtoEdited.likes + 10);

    })

  })

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test("creation fails if password is missing or too short", async () => {
    const userWithNoPassword = {
      username: 'root',
    }
  
    const userWithShortPassword = {
      username: 'root',
      password: 'ab',  
    }

    let result = await api
    .post('/api/users')
    .send(userWithNoPassword)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('Password must be at least 3 characters long'))

  // Testi liian lyhyellä salasanalla
  result = await api
    .post('/api/users')
    .send(userWithShortPassword)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('Password must be at least 3 characters long'))
  })



})



after(async () => {
  await mongoose.connection.close()
})


// Testeissä jäätiin siihen että korjaa testit, muokattu middlewarea joka hakee tokenin, sitä pitää ehkä vielä muokata että jos testeis tarvitaan error niin se palauttaa oikean eli 400 tai 401