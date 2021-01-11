import axios from 'axios'
const { REACT_APP_SERVER_URL } = process.env

export const userCart = async (cart, authtoken) =>
  await axios.post(
    `${REACT_APP_SERVER_URL}/api/user/cart`,
    { cart },
    {
      headers: {
        authtoken,
      },
    }
  )

export const getUserCart = async (authtoken) =>
  await axios.get(`${REACT_APP_SERVER_URL}/api/user/cart`, {
    headers: {
      authtoken,
    },
  })

export const savePersonalInfo = async (personalInfo, authtoken) =>
  await axios.post(
    `${REACT_APP_SERVER_URL}/api/user/personal-info`,
    { personalInfo },
    {
      headers: {
        authtoken,
      },
    }
  )

export const saveOrderToDB = async (authtoken) =>
  await axios.post(
    `${REACT_APP_SERVER_URL}/api/user/order`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  )

export const removeCart = async (authtoken) =>
  await axios.delete(`${REACT_APP_SERVER_URL}/api/user/cart`, {
    headers: {
      authtoken,
    },
  })

export const readOrder = async (id, authtoken) =>
  await axios.get(`${REACT_APP_SERVER_URL}/api/user/order/${id}`, {
    headers: {
      authtoken,
    },
  })
