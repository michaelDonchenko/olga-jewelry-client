import { Button, CircularProgress, Grid, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { getUserCart } from '../controllers/userControllers'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core'
import { savePersonalInfo } from '../controllers/userControllers'
import { Alert } from '@material-ui/lab'
import { saveOrderToDB } from '../controllers/userControllers'
import { removeCart } from '../controllers/userControllers'
import { EMPTY_CART } from '../types/cartTypes'

const useStyles = makeStyles({
  personalInfoButton: {
    color: 'black',
    backgroundColor: '#bbdefb',
    '&:hover': {
      backgroundColor: '#90caf9',
    },
  },
  createOrderButton: {
    color: 'white',
    backgroundColor: '#388e3c',
    '&:hover': {
      backgroundColor: '#2e7d32',
    },
  },
  link: {
    textDecoration: 'none',
    display: 'block',
    color: 'Graytext',
    display: 'inline',
  },
})

const Checkout = ({ history }) => {
  const user = useSelector((state) => state.user)
  const classes = useStyles()
  const dispatch = useDispatch()

  const [state, setState] = useState({
    cartSummary: '',
    loading: '',
    userInfoLoading: '',
    orderLoading: '',
    error: '',
    message: '',
    success: '',
    order: '',
  })

  const [personalInfo, setPersonalInfo] = useState({
    email: user && user.email,
    fullName: '',
    phoneNumber: '',
    city: '',
    country: '',
    zipCode: '',
    address: '',
  })

  const {
    cartSummary,
    loading,
    error,
    userInfoLoading,
    orderLoading,
    message,
    success,
    order,
  } = state
  const {
    email,
    fullName,
    phoneNumber,
    city,
    country,
    zipCode,
    address,
  } = personalInfo

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const handleResize = (e) => {
    setWindowWidth(window.innerWidth)
  }

  const saveUserInfo = async (e) => {
    e.preventDefault()
    setState({ ...state, userInfoLoading: true })
    try {
      const { data } = await savePersonalInfo(personalInfo, user.token)
      setState({
        ...state,
        userInfoLoading: false,
      })
      if (data.ok) {
        setState({
          ...state,
          message:
            'Your information is succefully saved, you can now create your order.',
          success: true,
        })
      }
    } catch (error) {
      setState({
        ...state,
        userInfoLoading: false,
        error: 'There was an error please try again or contact the admin.',
        message: false,
        success: false,
      })
    }
  }

  const userCart = async () => {
    setState({ ...state, loading: true })
    try {
      const { data } = await getUserCart(user.token)
      setState({ ...state, loading: false, cartSummary: data })
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: error.response.data.error,
      })
    }
  }

  const deleteCart = async () => {
    try {
      const { data } = await removeCart(user.token)
      if (data.ok) {
        // remove from local storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart')
        }
        // remove from redux
        dispatch({
          type: EMPTY_CART,
          payload: [],
        })
      }
    } catch (error) {
      setState({ ...state, error: error.response.data.error })
    }
  }

  window.addEventListener('resize', handleResize)

  useEffect(() => {
    userCart()
  }, [])

  const onChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value })
  }

  const placeOrder = async (e) => {
    e.preventDefault()
    setState({ ...state, orderLoading: true })
    try {
      const { data } = await saveOrderToDB(user.token)
      if (data._id) {
        await deleteCart()
        history.push(`/order-success/${data._id}`)
      }
    } catch (error) {
      setState({ ...state, orderLoading: false })
    }
  }

  return (
    <div>
      {loading && (
        <div style={{ textAlign: 'center', margin: '15px 0' }}>
          <CircularProgress />
        </div>
      )}
      <Grid container style={{ marginBottom: '40px' }}>
        <Grid item xs={12} md={6} style={{ marginBottom: '30px' }}>
          <h2>Personal Info:</h2>
          {success ? (
            message && (
              <>
                <Alert style={{ marginRight: '15px' }} severity="success">
                  {message}
                </Alert>
                <Alert
                  style={{ marginRight: '15px', marginTop: '15px' }}
                  severity="info"
                >
                  *Please Note: After you click on create order, your order will
                  be sent to the admin and you will not be able to change the
                  details anymore. Make sure eveything is correct and if needed
                  you can go back now and change it.
                </Alert>
              </>
            )
          ) : (
            <form onSubmit={saveUserInfo}>
              <div>
                <TextField
                  onChange={onChange}
                  name="email"
                  value={email}
                  required
                  type="email"
                  style={{
                    width: windowWidth > 600 ? '60%' : '100%',
                    margin: '10px 0',
                  }}
                  label="Email address"
                />
                <TextField
                  onChange={onChange}
                  name="fullName"
                  value={fullName}
                  required
                  type="text"
                  style={{
                    width: windowWidth > 600 ? '60%' : '100%',
                    margin: '10px 0',
                  }}
                  label="Full name"
                />
                <TextField
                  onChange={onChange}
                  value={phoneNumber}
                  name="phoneNumber"
                  required
                  type="number"
                  style={{
                    width: windowWidth > 600 ? '60%' : '100%',
                    margin: '10px 0',
                  }}
                  label="Phone number"
                />
                <h3>Delivery Adress:</h3>
                <TextField
                  onChange={onChange}
                  value={city}
                  name="city"
                  required
                  type="text"
                  style={{
                    width: windowWidth > 600 ? '60%' : '100%',
                    margin: '10px 0',
                  }}
                  label="City"
                />

                <TextField
                  onChange={onChange}
                  value={country}
                  name="country"
                  required
                  type="text"
                  style={{
                    width: windowWidth > 600 ? '60%' : '100%',
                    margin: '10px 0',
                  }}
                  label="Contry"
                />

                <TextField
                  onChange={onChange}
                  value={zipCode}
                  name="zipCode"
                  required
                  type="number"
                  style={{
                    width: windowWidth > 600 ? '60%' : '100%',
                    margin: '10px 0',
                  }}
                  label="Postal/Zip code"
                />

                <TextField
                  onChange={onChange}
                  value={address}
                  name="address"
                  required
                  type="text"
                  style={{
                    width: windowWidth > 600 ? '60%' : '100%',
                    margin: '10px 0',
                  }}
                  label="Address (street/home number)"
                  helperText="Please enter street name and home number"
                />
              </div>
              {userInfoLoading && (
                <div style={{ textAlign: 'center', margin: '15px 0' }}>
                  <CircularProgress />
                </div>
              )}

              <Button
                type="submit"
                className={classes.personalInfoButton}
                variant="contained"
              >
                Confirm User information
              </Button>
            </form>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <h2>Order Summary:</h2>
          <hr></hr>
          <h3>Products</h3>
          <div>
            {cartSummary &&
              cartSummary.products.map((p, i) => (
                <div key={i} style={{ display: 'flex', margin: '10px 0' }}>
                  <img style={{ height: '50px' }} src={p.product.images[0]} />
                  <p style={{ margin: '0 10px' }}>
                    {p.product.name} x {p.count} = ₪{p.price * p.count}
                  </p>
                </div>
              ))}
          </div>
          <hr></hr>
          <div>
            <h3>Delivery and Payment fee</h3>

            <p style={{ fontSize: '18px' }}>
              <span style={{ color: 'GrayText', marginRight: '5px' }}>
                Delivery Price:
              </span>{' '}
              ₪{cartSummary && cartSummary.deliveryPrice}
            </p>
            <p style={{ fontSize: '18px', marginRight: '5px' }}>
              <span style={{ color: 'GrayText' }}> Payment Fee: </span>
              {cartSummary &&
                cartSummary.paymentMethod === '2' &&
                'Payment Fee +5% (PayPal payment)'}
              {cartSummary &&
                cartSummary.paymentMethod !== '2' &&
                'No payment Fee'}
            </p>
          </div>
          <hr></hr>
          <div>
            <h3>
              Total price:
              <span style={{ marginLeft: '10px', fontSize: '1.5rem' }}>
                ₪{cartSummary && cartSummary.cartTotal}
              </span>
            </h3>
          </div>
          <hr></hr>
          {orderLoading && (
            <div style={{ textAlign: 'center', margin: '15px 0' }}>
              <CircularProgress />
            </div>
          )}
          <div>
            {success ? (
              <Button
                onClick={placeOrder}
                className={classes.createOrderButton}
                type="submit"
                fullWidth
                variant="contained"
              >
                Finish and Create Order
              </Button>
            ) : null}
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Checkout
