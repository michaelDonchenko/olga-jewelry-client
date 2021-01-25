import axios from 'axios'
const { REACT_APP_SERVER_URL } = process.env

export const getOrders = async (authtoken, pageNumber) =>
  await axios.get(
    `${REACT_APP_SERVER_URL}/api/admin/orders?pageNumber=${pageNumber}`,
    {
      headers: { authtoken },
    }
  )

export const readOrder = async (id, authtoken) =>
  await axios.get(`${REACT_APP_SERVER_URL}/api/admin/order/${id}`, {
    headers: {
      authtoken,
    },
  })

export const updateOrder = async (
  id,
  { isPaid, orderStatus, trackNumber, url },
  authtoken
) =>
  await axios.put(
    `${REACT_APP_SERVER_URL}/api/admin/order/${id}`,
    { isPaid, orderStatus, trackNumber, url },
    {
      headers: {
        authtoken,
      },
    }
  )

export const readMessages = async (pageNumber, authtoken) =>
  await axios.get(
    `${REACT_APP_SERVER_URL}/api/admin/messages?pageNumber=${pageNumber}`,
    {
      headers: {
        authtoken,
      },
    }
  )

export const messageAnswer = async (id, { answer }, authtoken) =>
  await axios.put(
    `${REACT_APP_SERVER_URL}/api/admin/messageAnswer/${id}`,
    { answer },
    {
      headers: {
        authtoken,
      },
    }
  )
