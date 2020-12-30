import {
  Button,
  CircularProgress,
  Hidden,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import AdminNav from '../../components/admin/AdminNav'
import AdminSideNav from '../../components/admin/AdminSideNav'
import Grid from '@material-ui/core/Grid'
import {
  createCategory,
  listCategories,
  deleteCategory,
} from '../../controllers/categoryControllers'
import { useSelector } from 'react-redux'
import { Alert } from '@material-ui/lab'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Divider from '@material-ui/core/Divider'

const AdminCategories = () => {
  const user = useSelector((state) => state.user)

  const [state, setState] = useState({
    name: '',
    loading: '',
    loadCategories: '',
    error: '',
    success: '',
    deleteSuccess: '',
    deleteError: '',
    categories: '',
  })

  const {
    name,
    loading,
    error,
    success,
    loadCategories,
    categories,
    deleteSuccess,
    deleteError,
  } = state

  const getCategories = async () => {
    setState({ ...state, loadCategories: true })
    try {
      const { data } = await listCategories()
      setState({ ...state, loadCategories: false, categories: data })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => getCategories(), [])

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setState({ ...state, loading: true })
    try {
      await createCategory(user.token, name)

      const { data } = await listCategories()
      setState({
        ...state,
        loadCategories: false,
        categories: data,
        success: 'Category Created succefully',
        name: '',
        loading: false,
        error: false,
      })
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: error.response.data.error,
        success: false,
      })
    }
  }

  const handleDelete = async (token, slug) => {
    setState({ ...state, loadCategories: true })
    try {
      await deleteCategory(token, slug)
      const { data } = await listCategories()
      setState({
        ...state,
        loadCategories: false,
        categories: data,
        deleteError: false,
        deleteSuccess: 'Category Deleted succefully',
      })
    } catch (error) {
      console.log(error)
      setState({
        ...state,
        loadCategories: false,
        deleteSuccess: false,
        deleteError: error.response.data.error,
      })
    }
  }

  return (
    <>
      <h1 style={{ textAlign: 'center', margin: '30px 0' }}>Admin Dashboard</h1>

      <Hidden smDown>
        <AdminNav />
      </Hidden>

      <Hidden mdUp>
        <AdminSideNav />
      </Hidden>
      <h2 style={{ margin: '40px 0', textAlign: 'center' }}>Categories</h2>
      <Grid container>
        <Grid item md={6} xs={12}>
          <h3 style={{ textAlign: 'center', backgroundColor: '#fafafa' }}>
            Create new category
          </h3>

          {loading && (
            <div style={{ textAlign: 'center', margin: '15px 0' }}>
              <CircularProgress color='black' />
            </div>
          )}
          {error && (
            <Alert
              style={{ margin: '15px 0' }}
              severity='error'
              onClose={() => {
                setState({ ...state, error: false })
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              style={{ margin: '15px 0' }}
              severity='success'
              onClose={() => {
                setState({ ...state, success: false })
              }}
            >
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit} autoComplete='off'>
            <TextField
              onChange={handleChange}
              value={name}
              name='name'
              label='Category Name'
              fullWidth
              type='text'
              helperText='Enter Category Name'
              required
            />

            <Button
              style={{
                backgroundColor: '#212121',
                color: 'white',
                margin: '30px 0',
              }}
              className={''}
              type='submit'
              variant='contained'
            >
              Submit
            </Button>
          </form>
        </Grid>
        <Grid style={{ marginBottom: '50px' }} item md={6} xs={12}>
          <h3 style={{ textAlign: 'center', backgroundColor: '#fafafa' }}>
            Categories list
          </h3>
          {loadCategories && (
            <div style={{ textAlign: 'center', margin: '15px 0' }}>
              <CircularProgress color='black' />
            </div>
          )}
          {deleteSuccess && (
            <Alert
              style={{ margin: '15px' }}
              severity='success'
              onClose={() => {
                setState({ ...state, deleteSuccess: false })
              }}
            >
              {deleteSuccess}
            </Alert>
          )}
          {deleteError && (
            <Alert
              style={{ margin: '15px' }}
              severity='error'
              onClose={() => {
                setState({ ...state, deleteError: false })
              }}
            >
              {deleteError}
            </Alert>
          )}

          <List
            style={{
              width: '250px',
              margin: 'auto',
              overflowY: 'scroll',
              maxHeight: '500px',
            }}
          >
            {categories &&
              categories.map((c) => (
                <React.Fragment key={c._id}>
                  <ListItem style={{ margin: '5px 0' }}>
                    <ListItemText primary={c.name} />
                    <ListItemSecondaryAction>
                      <IconButton edge='end' aria-label='delete'>
                        <DeleteIcon
                          onClick={() => handleDelete(user.token, c.slug)}
                        />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
          </List>
        </Grid>
      </Grid>
    </>
  )
}

export default AdminCategories
