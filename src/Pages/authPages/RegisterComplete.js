import React, { useState, useEffect } from 'react'
import { auth } from '../../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { REGISTER_USER } from '../../types/userTypes'
import { createUser } from '../../controllers/authControllers'
import {
  Container,
  makeStyles,
  Button,
  TextField,
  CircularProgress,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'

const useStyles = makeStyles(() => ({
  inputField: {
    '& label.Mui-focused': {
      color: '#311b92',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#311b92',
    },
    marginBottom: '20px',
  },
  button: {
    marginBottom: '20px',
  },
}))

const RegisterComplete = ({ history }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const classes = useStyles()

  const [values, setValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    loading: '',
    error: '',
  })

  const { email, password, confirmPassword, loading, error } = values

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

    history.push('/user/profile')
  }

  useEffect(() => {
    setValues({
      ...values,
      email: window.localStorage.getItem('emailForRegistration'),
    })
  }, [])

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValues({ ...values, loading: true })

    if (password !== confirmPassword) {
      return setValues({
        ...values,
        loading: false,
        error: 'The passwords do not match, please try again.',
      })
    }

    if (password.length < 8) {
      return setValues({
        ...values,
        loading: false,
        error: 'Password has to be at least 8 characters long.',
      })
    }

    try {
      const result = await auth.signInWithEmailLink(email, window.location.href)

      if (result.user.emailVerified) {
        //remove email from local storage
        window.localStorage.removeItem('emailForRegistration')
        //get user id token
        let user = auth.currentUser
        await user.updatePassword(password)
        const idTokenResult = await user.getIdTokenResult()

        //redux store
        createUser(idTokenResult.token)
          .then((res) =>
            dispatch({
              type: REGISTER_USER,
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
      }
    } catch (error) {
      setValues({ ...values, loading: false, error: error.message })
    }
  }

  return (
    <Container
      maxWidth={'sm'}
      style={{ textAlign: 'center', paddingTop: '20px' }}
    >
      <h1>Complete Registration</h1>

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
          className={classes.inputField}
          value={email}
          name='email'
          label='Email'
          fullWidth
          type='email'
          helperText='Enter your email'
          disabled
          required
        />

        <TextField
          onChange={handleChange}
          className={classes.inputField}
          value={password}
          name='password'
          label='Password'
          fullWidth
          type='password'
          helperText='Enter your password'
          required
        />

        <TextField
          onChange={handleChange}
          className={classes.inputField}
          value={confirmPassword}
          name='confirmPassword'
          label='Confirm passwrod'
          fullWidth
          type='password'
          helperText='Enter your password again'
          required
        />

        <Button
          style={{ backgroundColor: '#311b92', color: 'white' }}
          className={classes.button}
          type='submit'
          fullWidth
          variant='contained'
        >
          Complete Registration
        </Button>
      </form>
      {JSON.stringify(values)}
    </Container>
  )
}

export default RegisterComplete
