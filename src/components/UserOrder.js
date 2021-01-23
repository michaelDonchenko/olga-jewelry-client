import React from 'react'
import ClearIcon from '@material-ui/icons/Clear'
import CheckIcon from '@material-ui/icons/Check'
import { Grid } from '@material-ui/core'
import moment from 'moment'

const UserOrder = ({ order }) => {
  return (
    <>
      <h3 style={{ textAlign: 'center', marginTop: '50px' }}>
        Order ID:
        <span
          style={{
            wordBreak: 'break-all',
            marginLeft: '15px',
          }}
        >
          {order._id}
        </span>
      </h3>
      <Grid
        style={{
          padding: '10px',
          marginBottom: '40px',
        }}
        container
      >
        <Grid
          style={{ padding: '10px', overflowX: 'auto' }}
          item
          sm={6}
          xs={12}
          md={4}
        >
          <h4>Order Details:</h4>
          <p>
            Created At:
            <span style={{ marginLeft: '10px' }}>
              {moment(order.createdAt).format('MMMM Do YYYY')}
            </span>
          </p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p>Order is Paid:</p>
            <span style={{ marginLeft: '10px' }}>
              {order && order.isPaid === false ? (
                <ClearIcon style={{ color: 'red', fontSize: '30px' }} />
              ) : (
                <CheckIcon style={{ color: 'green', fontSize: '30px' }} />
              )}
            </span>
          </div>
          <div>
            <p>
              Order Status:
              <span style={{ marginLeft: '10px' }}>{order.orderStatus}</span>
            </p>
          </div>
          <div>
            <h4>Tracking Number</h4>
            {order && !order.trackNumber ? (
              <p style={{ color: 'GrayText' }}>
                You will recive a tracking number when your package will be sent
              </p>
            ) : (
              <div>
                <p>Number: {order && order.trackNumber}</p>

                <p>
                  URL:
                  <a
                    style={{ marginLeft: '10px' }}
                    target="blank"
                    href={order && order.url}
                  >
                    {'Link'}
                  </a>
                </p>
              </div>
            )}
          </div>
        </Grid>

        <Grid
          style={{ padding: '10px', overflowX: 'auto' }}
          item
          sm={6}
          xs={12}
          md={4}
        >
          <h4>User and Delivery info:</h4>
          <p>
            Email:
            <span style={{ marginLeft: '10px' }}>
              {order && order.personalInfo.email}
            </span>
          </p>
          <p>
            Name:
            <span style={{ marginLeft: '10px' }}>
              {order && order.personalInfo.fullName}
            </span>
          </p>
          <p>
            Phone:
            <span style={{ marginLeft: '10px' }}>
              {order && order.personalInfo.phoneNumber}
            </span>
          </p>
          <p>
            Address:
            <span style={{ marginLeft: '10px' }}>
              {order && order.personalInfo.address}
            </span>
          </p>
          <p>
            City:
            <span style={{ marginLeft: '10px' }}>
              {order && order.personalInfo.city}
            </span>
          </p>
          <p>
            Country:
            <span style={{ marginLeft: '10px' }}>
              {order && order.personalInfo.country}
            </span>
          </p>
        </Grid>

        <Grid
          style={{ padding: '10px', overflowX: 'auto' }}
          item
          sm={6}
          xs={12}
          md={4}
        >
          <h4>Payment Info:</h4>

          <div>
            <p>
              Delivery Price:
              <span style={{ marginLeft: '10px' }}>
                ₪{order && order.paymentInfo.deliveryPrice}
              </span>
            </p>
            <p>
              Payment Fee:
              {order && order.paymentInfo.paymentMethod === '0' && (
                <span style={{ marginLeft: '10px' }}>No payment Fee</span>
              )}
              {order && order.paymentInfo.paymentMethod === '1' && (
                <span style={{ marginLeft: '10px' }}>No payment Fee</span>
              )}
              {order && order.paymentInfo.paymentMethod === '2' && (
                <span style={{ marginLeft: '10px' }}>
                  Payment Fee +5% (PayPal)
                </span>
              )}
            </p>
            <p>
              Payment Method:
              {order && order.paymentInfo.paymentMethod === '0' && (
                <span style={{ marginLeft: '10px' }}>Bank Transfer</span>
              )}
              {order && order.paymentInfo.paymentMethod === '1' && (
                <span style={{ marginLeft: '10px' }}>Phone Payment</span>
              )}
              {order && order.paymentInfo.paymentMethod === '2' && (
                <span style={{ marginLeft: '10px' }}>PayPal</span>
              )}
            </p>

            <h4>Products:</h4>

            <div>
              {order &&
                order.products.map((p, i) => (
                  <div key={i} style={{ display: 'flex', margin: '10px 0' }}>
                    <img style={{ height: '50px' }} src={p.product.images[0]} />
                    <p style={{ margin: '0 10px' }}>
                      {p.product.name} x {p.count} = ₪
                      {p.product.price * p.count}
                    </p>
                  </div>
                ))}
            </div>
            <h4>
              Total price:
              <span style={{ marginLeft: '10px' }}>
                ₪{order && order.paymentInfo.amount}
              </span>
            </h4>
          </div>
        </Grid>
      </Grid>
    </>
  )
}

export default UserOrder
