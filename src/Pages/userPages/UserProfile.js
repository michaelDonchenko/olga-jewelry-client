import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { postMessage, readMessages } from '../../controllers/userControllers'
import UserMessage from '../../components/UserMessage'

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
    subject: '',
    message: '',
    loading: '',
    loadingMessages: '',
    error: '',
    success: '',
    messages: [],
  })

  const {
    subject,
    message,
    loading,
    error,
    success,
    messages,
    loadingMessages,
  } = state

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setState({ ...state, loading: true })
    try {
      await postMessage({ subject, message }, user.token)
      const { data } = await readMessages(user.token)
      setState({
        ...state,
        loading: false,
        error: false,
        success: 'Message Posted',
        subject: '',
        message: '',
        messages: data,
      })
    } catch (error) {
      console.log(error)
      setState({ ...state, loading: false, error: error.response.data.error })
    }
  }

  const getMessages = async () => {
    setState({ ...state, loadingMessages: true })
    try {
      const { data } = await readMessages(user.token)
      setState({ ...state, loadingMessages: false, messages: data })
    } catch (error) {
      console.log(error)
      setState({
        ...state,
        loadingMessages: false,
        error: error.response.data.error,
      })
    }
  }

  useEffect(() => {
    getMessages()
  }, [])

  return (
    <div>
      <h1>User Profile</h1>
      <h3 style={{ marginBottom: '20px' }}>Hello {user && user.email}</h3>
      <hr style={{ marginBottom: '20px' }}></hr>
      {error && (
        <Alert
          style={{ margin: '15px auto', maxWidth: '90%' }}
          severity="error"
          onClose={() => {
            setState({ ...state, error: false })
          }}
        >
          {error}
        </Alert>
      )}

      <Grid container>
        <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
          <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div
              elevation={3}
              style={{
                padding: '15px',
                maxWidth: '300px',
                margin: '15px auto',
              }}
            >
              {success && (
                <Alert
                  style={{ margin: '15px auto', maxWidth: '90%' }}
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

              <h4>Send a new message</h4>
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
                New Message
              </Button>
            </div>
          </form>
        </Grid>
        <Grid item xs={12} md={8}>
          <h3 style={{ textAlign: 'center' }}>Your Messages</h3>
          {loadingMessages && (
            <div style={{ textAlign: 'center', margin: '15px 0' }}>
              <CircularProgress />
            </div>
          )}
          {!loading && messages && messages.length < 1 && (
            <h5 style={{ margin: '20px 0', textAlign: 'center' }}>
              You have no messages.
            </h5>
          )}
          {!loading &&
            messages &&
            messages.length > 0 &&
            messages.map((m, i) => (
              <UserMessage key={i} message={m} messageType={'user'} />
            ))}
        </Grid>
      </Grid>
    </div>
  )
}

export default UserProfile
