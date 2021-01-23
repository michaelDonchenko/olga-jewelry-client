import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Hidden,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import AdminNav from '../../components/admin/AdminNav'
import AdminSideNav from '../../components/admin/AdminSideNav'
import UserOrder from '../../components/UserOrder'
import { readOrder, updateOrder } from '../../controllers/adminControllers'

const AdminOrder = ({ match }) => {
  const user = useSelector((state) => state.user)
  const id = match.params.id

  const [state, setState] = useState({
    order: '',
    loading: '',
    error: '',
    success: '',
  })

  const { order, loading, error, success } = state
  const [isPaid, setIsPaid] = useState('')
  const [orderStatus, setOrderStatus] = useState('')
  const [trackNumber, setTrackNumber] = useState('')
  const [url, setUrl] = useState('')

  const getOrder = async () => {
    setState({ ...state, loading: true })
    try {
      const { data } = await readOrder(id, user.token)
      setState({ ...state, order: data, loading: false })
      setIsPaid(data.isPaid)
      setOrderStatus(data.orderStatus)
      setTrackNumber(data.trackNumber)
      setUrl(data.url)
    } catch (error) {
      setState({ ...state, loading: false, error: error.response.data.error })
    }
  }

  const handlePayChange = (event) => {
    setIsPaid(event.target.value === 'false' ? false : true)
  }

  const handleStatusCahnge = (e) => {
    setOrderStatus(e.target.value)
  }

  const handleNumberChange = (e) => {
    setTrackNumber(e.target.value)
  }

  const handleUrlChange = (e) => {
    setUrl(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setState({ ...state, loading: true })
    try {
      const { data } = await updateOrder(
        id,
        { isPaid, orderStatus, trackNumber, url },
        user.token
      )
      setState({
        ...state,
        loading: false,
        order: data,
        success: 'Order details changed succefully',
      })
    } catch (error) {
      setState({ ...state, loading: false, error: error.response.data.error })
    }
  }

  useEffect(() => {
    getOrder()
  }, [])

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '30px 0' }}>Admin Dashboard</h1>

      <Hidden smDown>
        <AdminNav />
      </Hidden>

      <Hidden mdUp>
        <AdminSideNav />
      </Hidden>

      <h3 style={{ margin: '50px 0 10px 0' }}>Change Order details</h3>
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
      {success && (
        <Alert
          style={{ margin: '15px 0' }}
          severity="success"
          onClose={() => {
            setState({ ...state, success: false })
          }}
        >
          {success}
        </Alert>
      )}

      {loading && (
        <div style={{ textAlign: 'center', margin: '15px 0' }}>
          <CircularProgress />
        </div>
      )}
      <div style={{ display: 'flex', margin: '20px 0' }}>
        <form>
          <div>
            <FormControl style={{ margin: '25px' }} component="fieldset">
              <FormLabel component="legend">Is Paid</FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender1"
                value={isPaid}
                onChange={handlePayChange}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="True"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="False"
                />
              </RadioGroup>
            </FormControl>

            <FormControl style={{ margin: '25px', width: '200px' }}>
              <InputLabel id="orderStatus">Order Status</InputLabel>
              <Select
                labelId="orderStatus"
                id="orderStatus"
                value={orderStatus}
                onChange={handleStatusCahnge}
              >
                <MenuItem value="Not Processed">Not Processed</MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
              </Select>
            </FormControl>

            <div style={{ display: 'inline' }}>
              <TextField
                onChange={handleNumberChange}
                value={trackNumber}
                style={{ margin: '25px' }}
                name="number"
                label="Track number"
              />
              <TextField
                onChange={handleUrlChange}
                value={url}
                style={{ margin: '25px' }}
                name="url"
                label="Url link"
              />
            </div>
          </div>
          <Button type="submit" onClick={handleSubmit} variant="contained">
            Save Changes
          </Button>
        </form>
      </div>
      {order && <UserOrder order={order} />}
    </div>
  )
}

export default AdminOrder
