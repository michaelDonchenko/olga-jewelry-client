import {
  Button,
  CircularProgress,
  Hidden,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import AdminNav from '../../components/admin/AdminNav'
import AdminSideNav from '../../components/admin/AdminSideNav'
import {
  getProducts,
  productRemove,
} from '../../controllers/productControllers'
import { useSelector } from 'react-redux'
import { Alert } from '@material-ui/lab'
import { storage } from '../../firebase'

const AdminProducts = ({ history }) => {
  const [state, setState] = useState({
    products: [],
    error: '',
    loading: '',
    deleteLoading: '',
    deleteSuccess: '',
    deleteError: '',
  })

  const user = useSelector((state) => state.user)

  const {
    products,
    loading,
    error,
    deleteError,
    deleteLoading,
    deleteSuccess,
  } = state

  const listProducts = async () => {
    setState({ ...state, loading: true })
    try {
      const { data } = await getProducts(user.token)
      setState({ ...state, products: data, loading: false })
    } catch (error) {
      console.log(error)
      setState({ ...state, error: error.response.data.error, loading: false })
    }
  }

  useEffect(() => listProducts(), [])

  const deleteProduct = async (imgs, id) => {
    try {
      const images = imgs
      // return console.log(images, id)

      for (let i = 0, len = images.length; i < len; i++) {
        let fileRef = await storage.refFromURL(images[i])
        fileRef.delete().then((res) => console.log(images[i], 'deleted'))
      }

      await productRemove(user.token, id)
      const { data } = await getProducts(user.token)

      setState({
        ...state,
        products: data,
        deleteLoading: false,
        deleteSuccess: 'Product Deleted succefully.',
        deleteError: false,
      })
    } catch (error) {
      console.log(error)
      setState({
        ...state,
        deleteError: error.response.data.error,
        deleteSuccess: false,
      })
    }
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '30px 0' }}>Admin Dashboard</h1>

      <Hidden smDown>
        <AdminNav />
      </Hidden>

      <Hidden mdUp>
        <AdminSideNav />
      </Hidden>

      <h2 style={{ textAlign: 'center', margin: '30px 0' }}>Products list</h2>
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

      {deleteError && (
        <Alert
          style={{ margin: '15px 0' }}
          severity='error'
          onClose={() => {
            setState({ ...state, deleteError: false })
          }}
        >
          {deleteError}
        </Alert>
      )}

      {deleteSuccess && (
        <Alert
          style={{ margin: '15px 0' }}
          severity='success'
          onClose={() => {
            setState({ ...state, deleteSuccess: false })
          }}
        >
          {deleteSuccess}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table aria-label='customized table'>
          <TableHead>
            <TableRow>
              <TableCell align='left'>Product name</TableCell>
              <TableCell align='left'>price</TableCell>
              <TableCell align='left'>category</TableCell>
              <TableCell align='left'>quantity</TableCell>
              <TableCell align='left'>Main image</TableCell>
              <TableCell align='left'></TableCell>
              <TableCell align='left'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products &&
              products.map((p) => (
                <TableRow key={p._id}>
                  <TableCell align='left'>{p.name}</TableCell>
                  <TableCell align='left'>{p.price}</TableCell>
                  <TableCell align='left'>
                    {p.category ? p.category.name : 'No category found'}
                  </TableCell>
                  <TableCell align='left'>{p.quantity}</TableCell>
                  <TableCell align='left'>
                    {
                      <img
                        style={{ height: '50px' }}
                        src={p.images[0]}
                        alt='Image not found'
                      />
                    }
                  </TableCell>
                  <TableCell align='left'>
                    <Button
                      onClick={() => history.push(`/admin/product/${p._id}`)}
                      variant='outlined'
                      color='primary'
                    >
                      Update
                    </Button>
                  </TableCell>
                  <TableCell align='left'>
                    <Button
                      onClick={() => deleteProduct(p.images, p._id)}
                      variant='outlined'
                      color='secondary'
                    >
                      {deleteLoading ? <CircularProgress /> : 'Delete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default AdminProducts
