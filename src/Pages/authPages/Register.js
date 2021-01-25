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
      color: '#7e57c2',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#7e57c2',
    },
    marginBottom: '20px',
    padding: '5px',
  },
  button: {
    marginBottom: '20px',
  },
}))

const Register = ({ history }) => {
  const { REACT_APP_CLIENT_URL } = process.env
  const classes = useStyles()

  const user = useSelector((state) => state.user)

  const [state, setState] = useState({
    email: '',
    loading: '',
    error: '',
    success: '',
  })

  if (user && user.role === 'admin') {
    history.push('/admin/dashboard')
  } else if (user && user.role !== 'admin') {
    // check if intended
    let intended = history.location.state
    if (intended) {
      history.push(intended.from)
    } else {
      history.push('/user/profile')
    }
  }

  const { email, error, loading, success } = state

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setState({ ...state, loading: true })
    try {
      const config = {
        url: `${REACT_APP_CLIENT_URL}/register/complete`,
        handleCodeInApp: true,
      }

      await auth.sendSignInLinkToEmail(email, config)

      //save user email in local storage
      window.localStorage.setItem('emailForRegistration', email)
      setState({
        ...state,
        email: '',
        loading: false,
        success: `Email was succefully sent to ${email}, check your mailbox to finish the registration.`,
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container
      maxWidth={'sm'}
      style={{ textAlign: 'center', paddingTop: '20px' }}
    >
      <h1>Register</h1>
      <p style={{ color: 'gray' }}>
        Please enter a valid email, confirmation link will be sent to your
        mailbox in order to complete your registration.
      </p>
      {loading && <CircularProgress color="black" />}
      {success && (
        <Alert
          style={{ margin: '15px 0' }}
          onClose={() => {
            setState({ ...state, success: false })
          }}
        >
          {success}
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
          style={{ backgroundColor: '#f3e5f5', color: 'black' }}
          className={classes.button}
          type="submit"
          fullWidth
          startIcon={<SendIcon />}
          variant="contained"
        >
          Submit Registration
        </Button>
      </form>
      <p>
        Already have an account?{' '}
        <Link style={{ color: 'GrayText', marginLeft: '5px' }} to="/login">
          Login
        </Link>
      </p>
    </Container>
  )
}

export default Register
