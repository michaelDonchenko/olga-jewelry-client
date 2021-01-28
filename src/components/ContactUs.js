import React from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  iconDiv: {
    fontSize: '50px',
    margin: '15px',
  },

  myIcons: {
    color: '#424242',
  },
})

const ContactUs = () => {
  const classes = useStyles()

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          margin: '80px 0',
        }}
      >
        <div className={classes.iconDiv}>
          <a
            target="_blank"
            href="https://www.instagram.com/odartshop/"
            className={classes.myIcons}
          >
            <i className="fab fa-instagram "></i>
          </a>
        </div>

        <div className={classes.iconDiv}>
          <a
            target="_blank"
            href="https://www.facebook.com/Olga.Don.art"
            className={classes.myIcons}
          >
            <i className="fab fa-facebook-square "></i>
          </a>
        </div>
        <div className={classes.iconDiv}>
          <a
            href="https://wa.me/972546659069"
            class="whatsapp_float"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i style={{ color: 'green' }} class="fab fa-whatsapp"></i>
          </a>
        </div>
        <span style={{ fontSize: '18px', fontWeight: '600' }}>
          054-665-9069
        </span>
      </div>
    </>
  )
}

export default ContactUs
