import { CircularProgress, Hidden } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import AdminNav from '../../components/admin/AdminNav'
import AdminSideNav from '../../components/admin/AdminSideNav'
import { useSelector } from 'react-redux'
import { readMessages } from '../../controllers/adminControllers'
import UserMessage from '../../components/UserMessage'
import { Link } from 'react-router-dom'
import { Pagination, PaginationItem } from '@material-ui/lab'

const Comments = ({ match }) => {
  const user = useSelector((state) => state.user)
  const pageNumber = match.params.pageNumber || 1

  const [state, setState] = useState({
    messages: [],
    loading: '',
    error: '',
    pages: '',
  })

  const { messages, loading, error, pages } = state

  const getMessages = async () => {
    setState({ ...state, loading: true })
    try {
      const { data } = await readMessages(pageNumber, user.token)
      setState({
        ...state,
        loading: false,
        messages: data.messages,
        pages: data.pages,
      })
    } catch (error) {
      setState({ ...state, loading: false, error: error.response.data.error })
    }
  }

  useEffect(() => {
    getMessages()
  }, [pageNumber])

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '30px 0' }}>Admin Dashboard</h1>

      <Hidden smDown>
        <AdminNav />
      </Hidden>

      <Hidden mdUp>
        <AdminSideNav />
      </Hidden>

      <h3 style={{ margin: '50px 0 10px 0', textAlign: 'center' }}>
        User Messages
      </h3>
      {loading && (
        <div style={{ textAlign: 'center', margin: '15px 0' }}>
          <CircularProgress />
        </div>
      )}

      {!loading && messages && messages.length < 1 && <p>No messages found</p>}
      {messages &&
        messages.length > 0 &&
        messages.map((m, i) => (
          <UserMessage key={i} message={m} messageType={'admin'} />
        ))}

      <div
        style={{
          margin: '15px 0 50px 0',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {pages && (
          <Pagination
            hidePrevButton
            hideNextButton
            showFirstButton
            showLastButton
            color="primary"
            count={pages}
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                page={pageNumber}
                to={`/admin/comments/${item.page}`}
                {...item}
              />
            )}
          />
        )}
      </div>
    </div>
  )
}

export default Comments
