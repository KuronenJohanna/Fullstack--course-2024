import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = (newContact) => {
    console.log(newContact)
    const request = axios.post(baseUrl, newContact)
    return request.then(response => response.data)
}


const deleteItem = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const update = (id, updatedElement) => {
    return axios.put(`${baseUrl}/${id}`, updatedElement)
  }

export default { getAll, create, deleteItem, update }