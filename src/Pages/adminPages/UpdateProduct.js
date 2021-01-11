import {
  Badge,
  Button,
  CircularProgress,
  FormControl,
  Hidden,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import AdminNav from '../../components/admin/AdminNav'
import AdminSideNav from '../../components/admin/AdminSideNav'
import { listCategories } from '../../controllers/categoryControllers'
import { useSelector } from 'react-redux'
import {
  readProduct,
  productUpdate,
} from '../../controllers/productControllers'
import { storage } from '../../firebase'
import { Alert } from '@material-ui/lab'
import Resizer from 'react-image-file-resizer'
import { v4 as uuidv4 } from 'uuid'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import CreateIcon from '@material-ui/icons/Create'

const UpdateProduct = ({ match, history }) => {
  const user = useSelector((state) => state.user)

  const id = match.params.id

  const [state, setState] = useState({
    loading: '',
    uploadLoading: '',
    error: '',
    uploadError: '',
    success: '',
    categories: '',
    loadCategories: '',
    name: '',
    category: '',
    image: [],
    description: '',
    price: '',
    quantity: '',
  })

  const [imgUrl, setImgUrl] = useState([])

  const {
    loading,
    uploadLoading,
    error,
    uploadError,
    success,
    categories,
    loadCategories,
    name,
    category,
    image,
    description,
    price,
    quantity,
  } = state

  const getProduct = async () => {
    setState({ ...state, loading: true })
    try {
      const categories = await listCategories()
      const { data } = await readProduct(id)
      setImgUrl(data.images && data.images)
      setState({
        ...state,
        loading: false,
        name: data.name,
        category: data.category && data.category._id,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        categories: categories.data,
      })
      // setState({})
    } catch (error) {
      console.log(error)
      setState({ ...state, loading: false, error: error.response.data.error })
    }
  }

  useEffect(() => getProduct(), [])

  const handleCategoryChange = (e) => {
    setState({ ...state, category: e.target.value })
  }

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleImageChange = async (e) => {
    setState({ ...state, image: e.target.files })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setState({ ...state, loading: true })
    try {
      await productUpdate(id, user.token, {
        name,
        description,
        category,
        price,
        quantity,
        images: imgUrl,
      })
      setState({
        ...state,
        name: '',
        category: '',
        image: [],
        description: '',
        price: '',
        quantity: '',
        loading: false,
        error: false,
      })
      setImgUrl([])
      history.push('/admin/products')
    } catch (error) {
      setState({
        ...state,
        error: error.response.data.error,
        loading: false,
        success: false,
      })
    }
  }

  const handleUpload = async () => {
    setState({ ...state, uploadLoading: true })

    if (image.length === 0) {
      return setState({
        ...state,
        uploadLoading: false,
        uploadError: 'Please choose at least one image to upload.',
      })
    }
    for (let i = 0, len = image.length; i < len; i++) {
      const resizeFile = (file) =>
        new Promise((resolve) => {
          Resizer.imageFileResizer(
            file,
            600,
            600,
            'JPEG',
            100,
            0,
            (uri) => {
              resolve(uri)
            },
            'base64'
          )
        })

      const file = image[i]
      const newFile = await resizeFile(file)
      let imgString = newFile.split('base64,')[1]
      let id = uuidv4()

      const uploadTask = storage
        .ref(`images/${id}`)
        .putString(imgString, 'base64', { contentType: 'image/jpeg' })

      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.log(error)
          return setState({
            ...state,
            uploadLoading: false,
            uploadError: 'could not upload the images.',
          })
        },
        () => {
          storage
            .ref('images')
            .child(id)
            .getDownloadURL()
            .then((url) => {
              setImgUrl((imgUrl) => [...imgUrl, url])
              setState({ ...state, uploadLoading: false })
            })
        }
      )
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

      <h2 style={{ textAlign: 'center', margin: '30px 0' }}>Update Product</h2>
      {loadCategories && (
        <div style={{ textAlign: 'center', margin: '15px 0' }}>
          <CircularProgress color="black" />
        </div>
      )}
      <div style={{ maxWidth: '500px', margin: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <Paper elevation={1} style={{ padding: '15px' }}>
            <TextField
              onChange={handleChange}
              style={{ margin: '15px 0' }}
              name="name"
              value={name}
              label="Name"
              fullWidth
              type="text"
              helperText="Enter product name"
              required
            ></TextField>

            <TextField
              onChange={handleChange}
              style={{ margin: '15px 0' }}
              name="description"
              value={description}
              label="Description"
              multiline
              rows={5}
              fullWidth
              type="text"
              helperText="Enter product description"
              required
            ></TextField>

            <TextField
              onChange={handleChange}
              style={{ margin: '15px 0' }}
              name="price"
              value={price}
              label="Price"
              fullWidth
              type="number"
              helperText="Enter product price"
              required
            ></TextField>

            <TextField
              onChange={handleChange}
              style={{ margin: '15px 0' }}
              name="quantity"
              value={quantity}
              label="Quantity"
              fullWidth
              type="number"
              helperText="Enter product quantity"
              required
            ></TextField>

            <FormControl fullWidth required style={{ margin: '15px 0' }}>
              <InputLabel id="demo-simple-select-label">
                Select Category
              </InputLabel>
              <Select
                onChange={handleCategoryChange}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
              >
                {categories &&
                  categories.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <input
              style={{
                fontSize: '16px',
                display: 'flex',
                flexWrap: 'wrap',
                marginTop: '30px',
              }}
              labelId="images"
              type="file"
              accept="image/*"
              multiple
              name="image"
              onChange={handleImageChange}
            />
            {uploadLoading && (
              <div style={{ textAlign: 'center', margin: '15px 0' }}>
                <CircularProgress color="black" />
              </div>
            )}
            {uploadError && (
              <Alert
                style={{ margin: '15px 0' }}
                severity="error"
                onClose={() => {
                  setState({ ...state, uploadError: false })
                }}
              >
                {uploadError}
              </Alert>
            )}

            <p style={{ color: 'GrayText' }}>
              *Select the images you want to upload, after chosing all the
              images press on upload images button to upload them to the server.
            </p>
            <Button
              onClick={handleUpload}
              startIcon={<CloudUploadIcon />}
              style={{
                backgroundColor: '#0d47a1',
                color: 'white',
                margin: '15px 0',
                padding: '5px 15px',
              }}
            >
              Upload Images
            </Button>
            <div>
              <h4>Uploaded images preview:</h4>

              {imgUrl.length === 0 ? (
                <h5>No images uploaded</h5>
              ) : (
                <>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      width: '80%',
                      margin: 'auto',
                    }}
                  >
                    {imgUrl.map((img) => (
                      <div style={{ margin: '15px' }}>
                        <Badge
                          onClick={() => {
                            let fileRef = storage.refFromURL(img)
                            fileRef
                              .delete()
                              .then(() => {
                                // File deleted successfully
                                console.log('File Deleted')
                                let newArray = imgUrl.filter(
                                  (image) => image !== img
                                )

                                setImgUrl(newArray)
                              })
                              .catch((error) => {
                                console.log(error)
                              })
                          }}
                          color="secondary"
                          badgeContent={
                            <Button style={{ color: 'white' }}>Delete</Button>
                          }
                        >
                          <img
                            style={{
                              maxHeight: '80px',
                              width: 'auto',
                            }}
                            src={img}
                          />
                        </Badge>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Paper>

          {loading && (
            <div style={{ textAlign: 'center', margin: '15px 0' }}>
              <CircularProgress color="black" />
            </div>
          )}
          {error && (
            <Alert
              style={{ margin: '15px 0' }}
              severity="error"
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
              severity="success"
              onClose={() => {
                setState({ ...state, success: false })
              }}
            >
              {success}
            </Alert>
          )}

          <Button
            style={{
              backgroundColor: 'black',
              color: 'white',
              margin: '40px 0 80px 0',
            }}
            fullWidth
            startIcon={<CreateIcon />}
            type="submit"
            variant="contained"
          >
            Update Product
          </Button>
        </form>
      </div>
    </div>
  )
}

export default UpdateProduct
