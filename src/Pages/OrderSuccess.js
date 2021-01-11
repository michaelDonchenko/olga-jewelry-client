import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { readOrder } from '../controllers/userControllers'

const OrderSuccess = ({ match }) => {
  const id = match.params.id

  const user = useSelector((state) => state.user)

  const [state, setState] = useState({
    order: '',
    loading: '',
    error: '',
  })

  const { order, loading, error } = state

  const getOrder = async () => {
    try {
      const { data } = await readOrder(id, user.token)
      setState({ ...state, order: data })
      console.log(order)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getOrder()
  }, [])

  return (
    <div>
      <h1>Order Succefully created</h1>
    </div>
  )
}

export default OrderSuccess
