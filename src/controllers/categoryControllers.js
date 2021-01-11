import axios from 'axios'
const { REACT_APP_SERVER_URL } = process.env

export const createCategory = async (authtoken, name) => {
  return await axios.post(
    `${REACT_APP_SERVER_URL}/api/category`,
    { name },
    {
      headers: {
        authtoken,
      },
    }
  )
}

export const listCategories = async () => {
  return await axios.get(`${REACT_APP_SERVER_URL}/api/categories`)
}

export const readCategory = async (slug, pageNumber, pageSize) => {
  return await axios.get(
    `${REACT_APP_SERVER_URL}/api/category/${slug}?pageNumber=${pageNumber}&pageSize=${pageSize}`
  )
}

export const deleteCategory = async (authtoken, slug) => {
  return await axios.delete(`${REACT_APP_SERVER_URL}/api/category/${slug}`, {
    headers: {
      authtoken,
    },
  })
}
