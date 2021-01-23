import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { postMessage } from '../controllers/userControllers'
import { Alert } from '@material-ui/lab'

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
    success: '',
  })

  const { email, subject, message, loading, error, success } = state

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setState({ ...state, loading: true })
    try {
      await postMessage({ email, subject, message }, user.token)
      setState({
        ...state,
        loading: false,
        error: false,
        success: 'Your message was succefully sent.',
        email: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      console.log(error)
      setState({ ...state, loading: false, error: error.response })
    }
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

        {success && (
          <Alert
            style={{ margin: '15px auto', maxWidth: '400px' }}
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
        {error && (
          <Alert
            style={{ margin: '15px auto', maxWidth: '400px' }}
            severity="error"
            onClose={() => {
              setState({ ...state, error: false })
            }}
          >
            {error}
          </Alert>
        )}

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
              rows={5}
              fullWidth
              type="text"
              helperText="Type your message"
              required
            ></TextField>

            {user ? (
              <Button
                variant="outlined"
                type="submit"
                style={{
                  color: '#3949ab',
                  margin: '15px 0',
                  padding: '5px 15px',
                  borderColor: '#3949ab',
                }}
              >
                Send A Message
              </Button>
            ) : (
              <p style={{ color: 'GrayText' }}>
                *Only logged in users can send messages
              </p>
            )}
          </Paper>
        </form>
      </Grid>
    </Grid>
  )
}

export default ContactUs
