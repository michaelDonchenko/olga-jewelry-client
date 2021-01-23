import React, { useState } from 'react'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import { useSelector } from 'react-redux'
import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip'
import CartTable from '../components/CartTable'
import { makeStyles } from '@material-ui/core'
import { userCart } from '../controllers/userControllers'

const useStyles = makeStyles({
  checkoutButton: {
    color: 'white',
    backgroundColor: '#43a047',
    '&:hover': {
      backgroundColor: '#388e3c',
    },
  },
  link: {
    textDecoration: 'none',
  },
})

const Cart = ({ history }) => {
  const classes = useStyles()
  const cart = useSelector((state) => state.cart)
  const user = useSelector((state) => state.user)

  const [state, setState] = useState({
    delivery: '',
    error: '',
    paymentMethod: '',
    loading: '',
  })

  const { delivery, paymentMethod, error, loading } = state

  const getProductsTotal = () => {
    return (
      cart &&
      cart.reduce((currentValue, nextValue) => {
        return Number(currentValue + nextValue.price * nextValue.count)
      }, 0)
    )
  }

  const processToCheckout = async () => {
    setState({ ...state, loading: true })
    try {
      const res = await userCart({ cart, delivery, paymentMethod }, user.token)
      setState({ ...state, loading: false })
      if (res.data.ok) {
        return history.push('/checkout')
      }
    } catch (error) {
      setState({ ...state, loading: false, error: error.response.data.error })
    }
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1 style={{ display: 'inline' }}>Your Cart </h1>
        <ShoppingCartIcon style={{ marginLeft: '15px', fontSize: '35px' }} />
      </div>
      <Grid container style={{ margin: '40px 0' }}>
        <Grid item xs={12} md={8}>
          {cart && cart.length < 1 ? (
            <div style={{ margin: '20px' }}>
              <h3 style={{ display: 'inline' }}>Your cart is empty.</h3>
              <Tooltip placement="top-end" title="Go back to Shop">
                <Link
                  style={{
                    color: 'blue',
                    marginLeft: '10px',
                    textDecoration: 'none',
                  }}
                  to={'/shop'}
                >
                  Continue shopping
                </Link>
              </Tooltip>
            </div>
          ) : (
            <>
              <div>
                <h3>Your Cart has {cart.length} Items.</h3>
                <CartTable cart={cart} />
              </div>
              <div>
                <h3>Delivery</h3>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    Choose Delivery Method
                  </FormLabel>
                  <RadioGroup
                    aria-label="delivery"
                    value={delivery}
                    onChange={(e) =>
                      setState({ ...state, delivery: e.target.value })
                    }
                  >
                    <FormControlLabel
                      value="16"
                      control={<Radio />}
                      label="Regular, registered with tracking number: ₪ 16"
                    />
                    <FormControlLabel
                      value="26"
                      control={<Radio />}
                      label="Boxit: ₪ 26"
                    />
                    <FormControlLabel
                      value="59"
                      control={<Radio />}
                      label="Express delivery (Two days delivery to your house, after the package is sent): ₪ 59"
                    />
                    <FormControlLabel
                      value="0"
                      control={<Radio />}
                      label="Self Pickup (Tel-Aviv Israel)"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <div>
                <h3>Payment </h3>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    Choose Payment Method
                  </FormLabel>
                  <RadioGroup
                    aria-label="delivery"
                    value={paymentMethod}
                    onChange={(e) =>
                      setState({ ...state, paymentMethod: e.target.value })
                    }
                  >
                    <FormControlLabel
                      value="0"
                      control={<Radio />}
                      label="Direct bank transfer"
                    />
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="Pay by phone (credit card, bit or any other)"
                    />
                    <FormControlLabel
                      value="2"
                      control={<Radio />}
                      label="PayPal (+5% to total price)"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <h2>Cart Summary:</h2>
          <hr></hr>
          <h3>Products</h3>
          <div>
            {cart &&
              cart.map((p, i) => (
                <div key={i}>
                  <p>
                    {p.name} x {p.count} = ₪{p.price * p.count}
                  </p>
                </div>
              ))}
          </div>
          <hr></hr>
          <div>
            <h3>Delivery price</h3>
            <p style={{ fontSize: '18px' }}>
              ₪{delivery && cart.length > 0 && delivery}
            </p>
          </div>
          <hr></hr>
          <div>
            <h3>Payment fee</h3>
            <p style={{ fontSize: '18px' }}>
              {paymentMethod === '2'
                ? 'Payment with PayPal +5%'
                : 'No payment fee.'}
            </p>
          </div>
          <hr></hr>
          <h3>
            Total price:{' '}
            <span style={{ marginLeft: '10px', fontSize: '1.5rem' }}>
              ₪
              {paymentMethod === '2' &&
                cart.length > 0 &&
                delivery &&
                Math.round((getProductsTotal() + Number(delivery)) * 1.05)}
              {paymentMethod !== '2' &&
                cart.length > 0 &&
                delivery &&
                Math.round(getProductsTotal() + Number(delivery))}
            </span>
          </h3>
          <hr></hr>
          {loading && (
            <div style={{ textAlign: 'center', margin: '15px 0' }}>
              <CircularProgress />
            </div>
          )}
          {!user && (
            <p style={{ color: 'GrayText' }}>
              Please{' '}
              <Link to="/login" className={classes.link}>
                log-In
              </Link>{' '}
              in order to continue to checkout.
            </p>
          )}
          {user && (
            <Button
              disabled={cart.length < 1 || !delivery || !paymentMethod}
              fullWidth
              variant="contained"
              className={classes.checkoutButton}
              onClick={processToCheckout}
            >
              Proccess to Checkout
            </Button>
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default Cart
