import {
  Button,
  CircularProgress,
  Hidden,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { Alert, Pagination, PaginationItem } from '@material-ui/lab'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import AdminNav from '../../components/admin/AdminNav'
import AdminSideNav from '../../components/admin/AdminSideNav'
import { getOrders } from '../../controllers/adminControllers'
import ClearIcon from '@material-ui/icons/Clear'
import CheckIcon from '@material-ui/icons/Check'
import { makeStyles } from '@material-ui/core'
import moment from 'moment'

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
  },
})

const AdminDashboard = ({ match }) => {
  const classes = useStyles()
  const user = useSelector((state) => state.user)
  const [state, setState] = useState({
    orders: [],
    loading: '',
    error: '',
    page: '',
    pages: '',
    pageSize: '',
  })

  const pageNumber = match.params.pageNumber || 1

  const { orders, loading, error, page, pages, pageSize } = state

  const listOrders = async () => {
    setState({ ...state, loading: true })
    try {
      const { data } = await getOrders(user.token, pageNumber)
      setState({
        ...state,
        loading: false,
        orders: data.orders,
        pages: data.pages,
        page: data.page,
        pageSize: data.pageSize,
      })
    } catch (error) {
      console.log(error)
      setState({ ...state, loading: false, error: error.message })
    }
  }

  useEffect(() => {
    listOrders()
  }, [pageNumber])

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '30px 0' }}>Admin Dashboard</h1>

      <Hidden smDown>
        <AdminNav />
      </Hidden>

      <Hidden mdUp>
        <AdminSideNav />
      </Hidden>

      <h2 style={{ textAlign: 'center', margin: '30px 0' }}>Orders</h2>
      <div>
        {loading && (
          <div style={{ textAlign: 'center', margin: '15px 0' }}>
            <CircularProgress />
          </div>
        )}

        {error && (
          <Alert
            style={{ margin: '15px 0' }}
            severity="error"
            onClose={() => {
              setState({ ...state, error: false })
            }}
          >
            {error}
          </Alert>
        )}

        <div>
          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Created At</TableCell>
                  <TableCell align="left">Order Status</TableCell>
                  <TableCell align="left">Is Paid</TableCell>
                  <TableCell align="left">User Email</TableCell>
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
                        <TableCell>{o.personalInfo.email}</TableCell>
                        <TableCell>
                          {o.paymentInfo.paymentMethod === '0'
                            ? 'Bank Transfer'
                            : o.paymentInfo.paymentMethod === '1'
                            ? 'Phone payment'
                            : 'PayPal'}
                        </TableCell>
                        <TableCell>
                          {o.trackNumber ? (
                            o.trackNumber
                          ) : (
                            <ClearIcon style={{ color: 'red' }} />
                          )}
                        </TableCell>
                        <TableCell>₪{o.paymentInfo.amount}</TableCell>
                        <TableCell>
                          <Link
                            className={classes.link}
                            to={`/admin/order/${o._id}`}
                          >
                            <Button variant="outlined" color="secondary">
                              View and Edit
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

        <div
          style={{
            margin: '15px 0 50px 0',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {pages && pages > 1 && (
            <Pagination
              hidePrevButton
              hideNextButton
              showFirstButton
              showLastButton
              color="primary"
              count={pages}
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  page={pageNumber}
                  to={`/admin/dashboard/${item.page}`}
                  {...item}
                />
              )}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
