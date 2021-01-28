import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  readOrder,
  getPaypalClientId,
  updatePayment,
} from '../controllers/userControllers'
import { CircularProgress, Grid } from '@material-ui/core'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { PayPalButton } from 'react-paypal-button-v2'
import { Alert, AlertTitle } from '@material-ui/lab'
import { Link } from 'react-router-dom'
import UserOrder from '../components/UserOrder'
import { makeStyles } from '@material-ui/core'
import BankTransferPayment from '../components/BankTransferPayment'
import PhonePayment from '../components/PhonePayment'

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
  },
})

const OrderSuccess = ({ match }) => {
  const classes = useStyles()
  const id = match.params.id
  const user = useSelector((state) => state.user)

  const [state, setState] = useState({
    order: '',
    loading: false,
    error: '',
    paymentSuccess: false,
  })

  const { order, loading, error, paymentSuccess } = state
  const [sdk, setSdk] = useState(false)

  const getOrder = async () => {
    try {
      const { data } = await readOrder(id, user.token)
      setState({ ...state, order: data })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(async () => {
    getOrder()
  }, [paymentSuccess])

  useEffect(() => {
    addPaypalScript()
  }, [])

  const addPaypalScript = async () => {
    try {
      const { data: clientId } = await getPaypalClientId(user.token)
      const script = document.createElement('script')

      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=ILS`
      script.async = true
      script.onload = () => {
        setSdk(true)
      }
      document.body.appendChild(script)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSuccess = async (paymentResult) => {
    try {
      if (paymentResult.status === 'COMPLETED') {
        await updatePayment(id, user.token, true)
        setState({ ...state, paymentSuccess: true })
      }
    } catch (error) {
      console.log(error)
      setState({ ...state, error: error.message })
    }
  }

  return (
    <div>
      <h2
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Order Succefully created{' '}
        <CheckCircleIcon
          style={{ fontSize: '40px', color: 'green', marginLeft: '10px' }}
        />
      </h2>
      <h2>Payment:</h2>

      {/* direct bank transfer */}
      <div>
        {order && !order.isPaid && order.paymentInfo.paymentMethod === '0' && (
          <BankTransferPayment />
        )}
      </div>

      {/* phone payment */}
      <div>
        {order && !order.isPaid && order.paymentInfo.paymentMethod === '1' && (
          <PhonePayment />
        )}
      </div>

      {/* PayPal payment */}
      <div>
        {order &&
          !order.isPaid &&
          !sdk &&
          order.paymentInfo.paymentMethod === '2' && (
            <div style={{ textAlign: 'center', margin: '15px 0' }}>
              <CircularProgress />
            </div>
          )}
        {order &&
          !order.isPaid &&
          sdk &&
          order.paymentInfo.paymentMethod === '2' && (
            <Grid container>
              <Grid item xs={12} md={6}>
                <div style={{ width: '300px', maxWidth: '90%' }}>
                  <PayPalButton
                    amount={order.paymentInfo.amount}
                    currency="ILS"
                    onSuccess={handleSuccess}
                    onError={() =>
                      setState({ ...state, error: 'Payment failed.' })
                    }
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <h4>
                  Order that is not paid within 24h will be cancelled by the
                  admin.
                </h4>
                <p>
                  *Please note that you can see your orders anytime at
                  <Link
                    className={classes.link}
                    style={{ margin: '0 5px' }}
                    to={'/user/profile'}
                  >
                    User Profile
                  </Link>
                </p>
              </Grid>
              <div
                style={{
                  textAlign: 'center',
                  width: '95%',
                  margin: '15px auto',
                  backgroundColor: '#f5f5f5',
                  padding: '10px 0',
                }}
              >
                <h4>
                  For any questions/customer support please contact us on
                  whatsApp
                </h4>
                <div>
                  <div>
                    <i
                      style={{ color: 'green' }}
                      className="fab fa-whatsapp fa-3x mt-2 mx-1"
                    ></i>
                    <span
                      style={{
                        marginLeft: '10px',
                        fontSize: '1.3rem',
                        fontWeight: '700',
                      }}
                    >
                      054-665-9069
                    </span>
                  </div>
                </div>
              </div>
            </Grid>
          )}
      </div>

      {/* payment success message */}
      {order && order.isPaid && (
        <>
          <Alert style={{ margin: '15px 0' }}>
            <AlertTitle>
              <h4>Thank you, Your payment was successfull.</h4>
            </AlertTitle>
            <hr></hr>
            <p>
              You can see your orders anytime at
              <Link style={{ margin: '0 5px' }} to={'/user/profile'}>
                User Profile
              </Link>
            </p>
            <p>
              Once your order is sent you will recive your track number and your
              order status will be changed accordingly.
            </p>
          </Alert>
          <div
            style={{
              textAlign: 'center',
              width: '95%',
              margin: '15px auto',
              backgroundColor: '#f5f5f5',
              padding: '10px 0',
            }}
          >
            <h4>
              For any questions/customer support please contact us on whatsApp
            </h4>
            <div>
              <div>
                <i
                  style={{ color: 'green' }}
                  className="fab fa-whatsapp fa-3x mt-2 mx-1"
                ></i>
                <span
                  style={{
                    marginLeft: '10px',
                    fontSize: '1.3rem',
                    fontWeight: '700',
                  }}
                >
                  054-665-9069
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      <h2>Order Details:</h2>

      <UserOrder order={order} />
    </div>
  )
}

export default OrderSuccess
