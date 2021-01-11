import { Button, Grid, Tooltip } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { readProduct } from '../controllers/productControllers'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import Carousel from 'react-material-ui-carousel'
import _ from 'lodash'
import { ADD_TO_CART } from '../types/cartTypes'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    display: 'block',
    color: 'Graytext',
    display: 'inline',
  },
  button: {
    margin: '10px',
    backgroundColor: 'black',
    color: 'white',
    '&:hover': {
      margin: '10px',
      backgroundColor: 'black',
      color: 'white',
    },
  },
})

const Product = ({ match, history }) => {
  const productId = match.params.id

  const classes = useStyles()
  const dispatch = useDispatch()

  const [state, setState] = useState({
    product: '',
    loading: '',
    error: '',
  })

  const { product, loading, error } = state

  const getProduct = async () => {
    setState({ ...state, loading: true })
    try {
      const res = await readProduct(productId)
      setState({ ...state, loading: false, product: res.data })
    } catch (error) {
      setState({ ...state, loading: false, error: error.response.data.error })
    }
  }

  useEffect(() => {
    getProduct()
  }, [])

  const goBackHandler = () => {
    history.goBack()
  }

  const handleAddToCart = () => {
    let cart = []
    if (typeof window !== undefined) {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }
      //push new product to cart
      cart.push({
        ...product,
        count: 1,
      })

      //remove duplicates
      let unique = _.uniqWith(cart, _.isEqual)
      //save to local storage
      localStorage.setItem('cart', JSON.stringify(unique))
      dispatch({
        type: ADD_TO_CART,
        payload: unique,
      })
    }
  }

  return (
    <div style={{ margin: '30px 0 ', overflowWrap: 'break-word' }}>
      <Link className={classes.link} onClick={goBackHandler}>
        <Button variant="contained" style={{ margin: '15px 0' }}>
          Go back
        </Button>
      </Link>
      <Grid container>
        <Grid style={{ textAlign: 'center' }} xs={12} md={6} item>
          <Carousel interval={3000} timeout={800}>
            {product &&
              product.images.map((p) => (
                <img style={{ maxWidth: '100%' }} src={p} />
              ))}
          </Carousel>
        </Grid>
        <Grid style={{ padding: '0 15px' }} xs={12} md={6} item>
          <h1 style={{ textAlign: 'center' }}>{product && product.name}</h1>
          <hr></hr>
          <p style={{ color: 'GrayText' }}>
            Details: <br></br>{' '}
            <span style={{ color: 'black' }}>
              {product && product.description}
            </span>
          </p>

          <p style={{ color: 'GrayText' }}>
            Price:{' '}
            <span
              style={{
                color: 'black',
                marginLeft: '10px',
                fontWeight: '600',
              }}
            >
              ₪{product.price}
            </span>
          </p>
          <p style={{ color: 'GrayText' }}>
            Status:
            {product.quantity > 0 ? (
              <span
                style={{
                  color: 'green',
                  marginLeft: '10px',
                }}
              >
                In Stock
              </span>
            ) : (
              <span style={{ color: 'red', marginLeft: '10px' }}>
                Out of stock
              </span>
            )}
          </p>
          <Link
            className={classes.link}
            to={
              product.category
                ? `/category/${product.category.slug}`
                : `/pageNotFound`
            }
          >
            <Tooltip placement="left-end" title="View Category">
              <p>
                Category:
                <span
                  style={{
                    color: 'black',
                    marginLeft: '10px',
                  }}
                >
                  {product.category
                    ? product.category.name
                    : 'Category not found'}
                </span>
              </p>
            </Tooltip>
          </Link>
          <hr></hr>
          <Tooltip placement="left-start" title="Add product to your cart">
            <Button
              onClick={handleAddToCart}
              startIcon={<ShoppingCartIcon />}
              className={classes.button}
              variant="contained"
              disabled={product.quantity < 1}
            >
              Add to Cart
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </div>
  )
}

export default Product
