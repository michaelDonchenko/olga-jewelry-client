import { Button, Paper, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { messageAnswer } from '../controllers/adminControllers'
import { useSelector } from 'react-redux'
import { Alert } from '@material-ui/lab'

const useStyle = makeStyles({
  input: {
    width: '400px',
    maxWidth: '90%',
  },
})

const UserMessage = ({ message, messageType }) => {
  const classes = useStyle()
  const user = useSelector((state) => state.user)

  const [state, setState] = useState({
    answer: '',
    loading: '',
    error: '',
    success: '',
  })

  const { answer, loading, error, success } = state

  const onChange = (e) => {
    setState({ ...state, answer: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setState({ ...state, loading: true })
    try {
      await messageAnswer(message._id, { answer }, user.token)

      setState({
        ...state,
        loading: false,
        success: 'Message Posted.',
        answer: '',
      })
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: 'Could not post the message.',
      })
    }
  }

  return (
    <div style={{ marginBottom: '30px' }}>
      <Paper elevation={2} style={{ padding: '10px' }}>
        <h4>
          <span style={{ color: 'GrayText', marginRight: '7px' }}>
            Subject:
          </span>
          {message.subject}
        </h4>
        <p>
          <span style={{ color: 'GrayText', marginRight: '7px' }}>
            Message:
          </span>
          {message.message}
        </p>

        {/* USER CASES */}
        {messageType === 'user' && (
          <p>
            <span style={{ color: 'GrayText', marginRight: '7px' }}>
              Admin:
            </span>
            {message.answer === null ? (
              <span style={{ color: 'red' }}>Not yet answered...</span>
            ) : (
              message.answer
            )}
          </p>
        )}

        {/* ADMIN CASES */}
        {messageType === 'user' ? null : (
          <p>
            <span style={{ color: 'GrayText' }}>Posted by:</span>
            <span style={{ fontWeight: '600', marginLeft: '10px' }}>
              {message.postedBy.email}
            </span>
          </p>
        )}

        {messageType === 'admin' && message.answer === null && !success && (
          <form onSubmit={onSubmit}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <TextField
                className={classes.input}
                style={{ width: '500px' }}
                variant="outlined"
                onChange={onChange}
                style={{ margin: '15px 0 15px 20px' }}
                name="answer"
                value={answer}
                label="Type Answer"
                type="text"
                required
              ></TextField>
              <Button
                color="primary"
                style={{
                  height: '50px',
                  width: '150px',
                  marginLeft: '20px',
                }}
                type="submit"
                variant="outlined"
              >
                Send
              </Button>
            </div>
          </form>
        )}

        {messageType === 'admin' && message.answer !== null && (
          <p>
            <span style={{ color: 'GrayText', marginRight: '7px' }}>
              Your answer:
            </span>
            {message.answer}
          </p>
        )}

        {messageType === 'admin' && success && (
          <Alert style={{ marginRight: '15px' }} severity="success">
            {success}
          </Alert>
        )}
        {messageType === 'admin' && error && (
          <Alert style={{ marginRight: '15px' }} severity="error">
            {error}
          </Alert>
        )}
      </Paper>
    </div>
  )
}

export default UserMessage
