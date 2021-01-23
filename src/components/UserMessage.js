import React from 'react'

const UserMessage = ({ message }) => {
  return (
    <div style={{ borderBottom: '1px solid' }}>
      <h4>{message.subject}</h4>
      <p>{message.message}</p>
      <p>
        Posted by:
        <span style={{ fontWeight: '600', marginLeft: '10px' }}>
          {message.email}
        </span>
      </p>
    </div>
  )
}

export default UserMessage
