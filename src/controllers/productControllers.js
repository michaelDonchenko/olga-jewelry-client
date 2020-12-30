import axios from 'axios'
const { REACT_APP_SERVER_URL } = process.env

export const productCreate = async (authtoken, values) => {
  return await axios.post(
    `${REACT_APP_SERVER_URL}/api/product`,
    { values },
    {
      headers: {
        authtoken,
      },
    }
  )
}

export const productUpdate = async (id, authtoken, values) => {
  return await axios.put(`${REACT_APP_SERVER_URL}/api/product/${id}`, values, {
    headers: {
      authtoken,
    },
  })
}

export const getProducts = async () => {
  return await axios.get(`${REACT_APP_SERVER_URL}/api/products`)
}

export const readProduct = async (id) => {
  return await axios.get(`${REACT_APP_SERVER_URL}/api/product/${id}`)
}

export const productRemove = async (authtoken, id) => {
  return await axios.delete(`${REACT_APP_SERVER_URL}/api/product`, {
    data: { id },
    headers: { authtoken },
  })
}

export const listProducts = async (values) => {
  return await axios.post(`${REACT_APP_SERVER_URL}/api/products`, values)
}
