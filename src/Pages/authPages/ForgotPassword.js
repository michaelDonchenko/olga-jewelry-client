import { Container, makeStyles, Button, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SendIcon from '@material-ui/icons/Send'
import { auth } from '../../firebase'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Alert } from '@material-ui/lab'
import { useSelector } from 'react-redux'

const useStyles = makeStyles(() => ({
  inputField: {
    '& label.Mui-focused': {
      color: '#f06292',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#f06292',
    },
    marginBottom: '20px',
    padding: '5px',
  },
  button: {
    marginBottom: '20px',
  },
}))

const ForgotPassword = ({ history }) => {
  const { REACT_APP_CLIENT_URL } = process.env
  const classes = useStyles()

  const user = useSelector((state) => state.user)

  if (user && user.role === 'subscriber') {
    history.push('/user/profile')
  }

  if (user && user.role === 'admin') {
    history.push('/admin/dashboard')
  }

  const [state, setState] = useState({
    email: '',
    loading: '',
    error: '',
    success: '',
  })

  const { email, error, loading, success } = state

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    let userEmail = email
    setState({ ...state, loading: true })
    try {
      const config = {
        url: `${REACT_APP_CLIENT_URL}/login`,
        handleCodeInApp: true,
      }

      await auth.sendPasswordResetEmail(email, config)
      setState({
        ...state,
        loading: false,
        error: false,
        email: '',
        success: `Password link was sent to ${userEmail} , please check your mailbox to continue.`,
      })
    } catch (error) {
      setState({
        ...state,
        loading: false,
        success: false,
        error: error.message,
      })
    }
  }

  return (
    <Container
      maxWidth={'sm'}
      style={{ textAlign: 'center', paddingTop: '20px' }}
    >
      <h1>Password Reset</h1>
      <p style={{ color: 'gray' }}>
        Password reset link will be sent to your mailbox. {<br></br>} *Please
        Note: The new password you create must be at least 8 characters long,
        otherwise you will not be able to login with your new password!
      </p>
      {loading && <CircularProgress />}
      {success && (
        <Alert
          severity="success"
          style={{ margin: '15px 0' }}
          onClose={() => {
            setState({ ...state, success: false })
          }}
        >
          {success}
        </Alert>
      )}
      {error && (
        <Alert
          severity="error"
          style={{ margin: '15px 0' }}
          onClose={() => {
            setState({ ...state, success: false })
          }}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={submitHandler} autoComplete="off">
        <TextField
          onChange={handleChange}
          className={classes.inputField}
          value={email}
          name="email"
          label="Email"
          fullWidth
          type="email"
          helperText="Enter your email"
          required
        />

        <Button
          style={{ backgroundColor: '#f06292', color: 'white' }}
          className={classes.button}
          type="submit"
          fullWidth
          startIcon={<SendIcon />}
          variant="contained"
        >
          Submit
        </Button>
      </form>
      <p>
        Go back to{' '}
        <Link style={{ color: 'GrayText', marginLeft: '5px' }} to="/login">
          Login
        </Link>
      </p>
    </Container>
  )
}

export default ForgotPassword
