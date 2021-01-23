import {
  Button,
  CircularProgress,
  Grid,
  List,
  Paper,
  TextField,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core'
import { NavLink } from 'react-router-dom'
import { Alert } from '@material-ui/lab'
import { postMessage } from '../../controllers/userControllers'

const useStyles = makeStyles({
  button: {
    width: '250px',
    maxWidth: '90%',
    marginBottom: '15px',
    color: 'black',
    backgroundColor: 'white',
    '&:hover': {
      color: 'black',
      backgroundColor: 'white',
    },
  },

  link: {
    textDecoration: 'none',
    padding: '2px',
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    flexWrap: 'wrap',
    color: 'white',
  },
})

const UserProfile = () => {
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
      setState({ ...state, loading: false, error: error.response.data.error })
    }
  }

  useEffect(() => {
    if (user) {
      setState({ ...state, email: user.email })
    }
  }, [])

  return (
    <div>
      <h1>User Profile</h1>
      <h3 style={{ marginBottom: '50px' }}>Hello {user && user.email}</h3>
      <hr></hr>
      <Grid container>
        <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
          <h3>Quick Navigation</h3>
          <List component="nav" className={classes.flexContainer}>
            <NavLink className={classes.link} to="/">
              <Button variant="contained" className={classes.button}>
                Home
              </Button>
            </NavLink>
            <NavLink className={classes.link} to="/shop">
              <Button variant="contained" className={classes.button}>
                Shop
              </Button>
            </NavLink>
            <NavLink className={classes.link} to="/cart">
              <Button variant="contained" className={classes.button}>
                Cart
              </Button>
            </NavLink>
            <NavLink className={classes.link} to="/user/history">
              <Button variant="contained" className={classes.button}>
                Purchase History
              </Button>
            </NavLink>
          </List>
        </Grid>
        <Grid item xs={12} md={8}>
          <h3 style={{ textAlign: 'center' }}>Send us a message</h3>

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

          <form onSubmit={handleSubmit} style={{ marginBottom: '50px' }}>
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
            </Paper>
          </form>
        </Grid>
      </Grid>
    </div>
  )
}

export default UserProfile
