import axios from 'axios'
const { REACT_APP_SERVER_URL } = process.env

export const createUser = async (authtoken) => {
  return await axios.post(
    `${REACT_APP_SERVER_URL}/api/create-user`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  )
}

export const login = async (authtoken) => {
  return await axios.post(
    `${REACT_APP_SERVER_URL}/api/login`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  )
}
