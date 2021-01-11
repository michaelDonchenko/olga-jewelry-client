import { Button, Grid, Paper, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'

const useStyles = makeStyles({
  iconDiv: {
    fontSize: '40px',
    margin: '10px',
  },

  myIcons: {
    color: '#424242',
  },
})

const ContactUs = () => {
  const classes = useStyles()
  const user = useSelector((state) => state.user)

  const [state, setState] = useState({
    email: '',
    subject: '',
    message: '',
    loading: '',
    error: '',
  })

  const { email, subject, message, loading, error } = state

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  useEffect(() => {
    if (user) {
      setState({ ...state, email: user.email })
    }
  }, [])

  return (
    <Grid container>
      <Grid md={6} xs={12} item>
        <h3 style={{ textAlign: 'center' }}>Social Media</h3>
        <div
          className="my-3"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
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
            <i class="fab fa-whatsapp"></i>
          </div>
          <span>054-665-9069</span>
        </div>
      </Grid>
      <Grid md={6} xs={12} item>
        <h3 style={{ textAlign: 'center' }}>Send a Message</h3>
        <form onSubmit={handleSubmit}>
          <Paper
            elevation={3}
            style={{ padding: '15px', maxWidth: '400px', margin: 'auto' }}
          >
            <TextField
              onChange={onChange}
              style={{ margin: '15px 0' }}
              name="email"
              value={email}
              label="Email"
              fullWidth
              helperText="Enter diffrent email if you want to"
              type="text"
              required
            ></TextField>
            <TextField
              onChange={onChange}
              style={{ margin: '15px 0' }}
              name="subject"
              value={subject}
              label="Subject"
              fullWidth
              helperText="Type your subject"
              type="text"
              required
            ></TextField>

            <TextField
              onChange={onChange}
              style={{ margin: '15px 0' }}
              name="message"
              value={message}
              label="Message"
              multiline
              rows={3}
              fullWidth
              type="text"
              helperText="Type your message"
              required
            ></TextField>

            <Button
              type="submit"
              style={{
                backgroundColor: '#0d47a1',
                color: 'white',
                margin: '15px 0',
                padding: '5px 15px',
              }}
            >
              Send A Message
            </Button>
          </Paper>
        </form>
      </Grid>
    </Grid>
  )
}

export default ContactUs
