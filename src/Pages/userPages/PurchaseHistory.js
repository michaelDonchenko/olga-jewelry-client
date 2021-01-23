import React, { useState, useEffect } from 'react'
import { userOrders } from '../../controllers/userControllers'
import { useSelector } from 'react-redux'
import { Button, CircularProgress, makeStyles } from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import CheckIcon from '@material-ui/icons/Check'
import { Link } from 'react-router-dom'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import moment from 'moment'

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
  },
})

const PurchaseHistory = () => {
  const classes = useStyles()
  const user = useSelector((state) => state.user)
  const [state, setState] = useState({
    orders: [],
    loading: '',
    error: '',
  })

  const { orders, loading, error } = state

  const getUserOrdrs = async () => {
    setState({ ...state, loading: true })
    try {
      const { data } = await userOrders(user.token)
      console.log(data)
      setState({ ...state, orders: data, loading: false })
    } catch (error) {
      console.log(error.message)
      setState({ ...state, error: error.message, loading: false })
    }
  }

  useEffect(() => {
    getUserOrdrs()
  }, [])

  return (
    <div>
      <h1>Purchase History</h1>
      <h3>My Orders</h3>
      <hr></hr>
      {loading && (
        <div style={{ textAlign: 'center', margin: '15px 0' }}>
          <CircularProgress />
        </div>
      )}
      {orders && !loading && orders.length < 1 ? (
        <p>No orders found</p>
      ) : (
        <div>
          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Created At</TableCell>
                  <TableCell align="left">Order Status</TableCell>
                  <TableCell align="left">Is Paid</TableCell>
                  <TableCell align="left">Payment Method</TableCell>
                  <TableCell align="left">Track Number</TableCell>
                  <TableCell align="left">Total Price</TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders && orders.length > 0
                  ? orders.map((o, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          {moment(o.createdAt).format('MMMM Do YYYY')}
                        </TableCell>
                        <TableCell>{o.orderStatus}</TableCell>
                        <TableCell>
                          {o.isPaid === true ? (
                            <CheckIcon style={{ color: 'green' }} />
                          ) : (
                            <ClearIcon style={{ color: 'red' }} />
                          )}
                        </TableCell>
                        <TableCell>
                          {o.paymentInfo.paymentMethod === '0'
                            ? 'Bank Transfer'
                            : o.paymentInfo.paymentMethod === '1'
                            ? 'Phone payment'
                            : 'PayPal'}
                        </TableCell>
                        <TableCell>
                          {o.trackNumber ? o.trackNumber : 'Not yet Recived'}
                        </TableCell>
                        <TableCell>₪{o.paymentInfo.amount}</TableCell>
                        <TableCell>
                          <Link
                            className={classes.link}
                            to={`/user/order/${o._id}`}
                          >
                            <Button variant="outlined" color="secondary">
                              View Full Details
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  )
}

export default PurchaseHistory
