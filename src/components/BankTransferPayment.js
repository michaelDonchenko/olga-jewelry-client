import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { Grid } from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'

const BankTransferPayment = () => {
  return (
    <div style={{ margin: '15px 0' }}>
      <Grid container>
        <Grid item sm={6} xs={12}>
          <Card style={{ maxWidth: '90%', margin: '0 auto' }}>
            <CardContent style={{ textAlign: 'center' }}>
              <h4>Payment details for bank transfer:</h4>
              <p>בנק מזרחי טפחות - 20</p>
              <p>סניף ברק - 576</p>
              <p>חשבון 261176</p>
              <p>אולגה דונצ'נקו</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Alert severity="info" style={{ margin: '15px 0' }}>
            <AlertTitle>Important, please make sure to do:</AlertTitle>
            <hr></hr>
            Send us a payment screenshot on whatsApp to this number{' '}
            <span style={{ fontWeight: '700' }}>054-665-9069</span>, in order to
            make sure we know the payment is done.
            <hr></hr>
            <p>
              **Order that is not paid within 24h will be cancelled by the
              admin!
            </p>
            <p>
              Once the admin recive your payment your order status will be
              changed to paid.
            </p>
          </Alert>
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
      </Grid>
    </div>
  )
}

export default BankTransferPayment
