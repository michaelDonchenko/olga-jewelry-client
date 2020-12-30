import {
  Container,
  TextField,
  makeStyles,
  Button,
  CircularProgress,
} from '@material-ui/core'
import EmailIcon from '@material-ui/icons/Email'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { auth, googleAuthProvider } from '../../firebase'
import { login } from '../../controllers/authControllers'
import { Alert } from '@material-ui/lab'
import { LOGIN_USER } from '../../types/userTypes'

const useStyles = makeStyles(() => ({
  inputField: {
    '& label.Mui-focused': {
      color: 'purple',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'purple',
    },
    marginBottom: '20px',
  },
  button: {
    marginBottom: '20px',
  },
}))

const Login = ({ history }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user)
  if (user) {
    localStorage.setItem(
      'userInfo',
      JSON.stringify({
        email: user.email,
        token: user.token,
        role: user.role,
        id: user.id,
      })
    )
  }

  const [values, setValues] = useState({
    email: '',
    password: '',
    loading: '',
    error: '',
  })

  const { email, password, loading, error } = values

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValues({ ...values, loading: true })
    try {
      if (password.length < 8) {
        return setValues({
          ...values,
          loading: false,
          error: 'Password has to be at least 8 characters long.',
        })
      }

      const res = await auth.signInWithEmailAndPassword(email, password)
      const { user } = res

      const idTokenResult = await user.getIdTokenResult()

      login(idTokenResult.token)
        .then((res) =>
          dispatch({
            type: LOGIN_USER,
            payload: {
              email: res.data.email,
              token: idTokenResult.token,
              role: res.data.role,
              id: res.data._id,
            },
          })
        )
        .catch((error) =>
          setValues({
            ...values,
            loading: false,
            error: error.response.data.error,
          })
        )
    } catch (error) {
      setValues({ ...values, loading: false, error: error.message })
    }
  }

  const googleLogin = async (e) => {
    e.preventDefault()
    setValues({ ...values, loading: true })
    try {
      const res = await auth.signInWithPopup(googleAuthProvider)
      const { user } = res
      const idTokenResult = await user.getIdTokenResult()

      login(idTokenResult.token)
        .then((res) =>
          dispatch({
            type: LOGIN_USER,
            payload: {
              email: res.data.email,
              token: idTokenResult.token,
              role: res.data.role,
              id: res.data._id,
            },
          })
        )
        .catch((error) =>
          setValues({
            ...values,
            loading: false,
            error: error.response.data.error,
          })
        )
    } catch (error) {
      setValues({ ...values, loading: false, error: error.message })
    }
  }

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

  return (
    <Container
      maxWidth={'sm'}
      style={{ textAlign: 'center', paddingTop: '20px' }}
    >
      <h1>Login</h1>

      {loading && <CircularProgress color='black' />}
      {error && (
        <Alert
          style={{ margin: '15px 0' }}
          severity='error'
          onClose={() => {
            setValues({ ...values, error: false })
          }}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} autoComplete='off'>
        <TextField
          onChange={handleChange}
          value={email}
          className={classes.inputField}
          name='email'
          label='Email'
          fullWidth
          type='email'
          helperText='Enter your email'
          required
        />
        <TextField
          onChange={handleChange}
          value={password}
          className={classes.inputField}
          name='password'
          label='Password'
          fullWidth
          type='password'
          helperText='Enter your password'
          required
        />

        <Button
          style={{ backgroundColor: '#f3e5f5', color: 'black' }}
          className={classes.button}
          startIcon={<EmailIcon />}
          type='submit'
          fullWidth
          variant='contained'
        >
          Login with Email/Password
        </Button>
      </form>
      <Button
        onClick={googleLogin}
        style={{ backgroundColor: '#ffe0b2', color: 'black' }}
        className={classes.button}
        fullWidth
        variant='contained'
      >
        <i
          className='fab fa-google'
          style={{ marginRight: '8px', fontSize: '1.2rem' }}
        ></i>{' '}
        Login with Google account
      </Button>
      <p>
        <Link style={{ color: 'GrayText', marginLeft: '5px' }}>
          Forgot password?
        </Link>
      </p>
      <p>
        Don't have an account?
        <Link style={{ color: 'GrayText', marginLeft: '5px' }} to='/register'>
          Register
        </Link>
      </p>
    </Container>
  )
}

export default Login
