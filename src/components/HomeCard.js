import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import Tooltip from '@material-ui/core/Tooltip'
import _ from 'lodash'
import { ADD_TO_CART } from '../types/cartTypes'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles({
  root: {
    maxWidth: 250,
    height: 550,
    margin: '15px',
    border: '2px solid ',
    borderColor: '#fafafa',
    '&:hover': {
      boxShadow:
        'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    },
  },

  link: {
    textDecoration: 'none',
    color: 'black',
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

export default function HomeCard({ item }) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    let cart = []
    if (typeof window !== undefined) {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }
      //push new product to cart
      cart.push({
        ...item,
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
    <Card className={classes.root}>
      <div>
        <Link className={classes.link} to={`/product/${item._id}`}>
          <Tooltip placement="left-start" title={`View product ${item.name}`}>
            <img style={{ width: '100%' }} src={item.images[0]} />
          </Tooltip>
        </Link>
      </div>
      <div>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            <Link className={classes.link} to={`/product/${item._id}`}>
              <Tooltip
                placement="left-start"
                title={`View product ${item.name}`}
              >
                <h5 style={{ margin: '0' }}>
                  {item.name.substring(0, 20)}
                  {item.name.length > 20 && '...'}
                </h5>
              </Tooltip>
            </Link>
          </Typography>

          <Typography
            style={{ fontSize: '16px' }}
            variant="body2"
            color="textSecondary"
            component="p"
          >
            <p>
              Price:{' '}
              <span
                style={{
                  color: 'black',
                  marginLeft: '10px',
                  fontWeight: '600',
                }}
              >
                ₪{item.price}
              </span>
            </p>
            <p>
              Status:
              {item.quantity > 0 ? (
                <span
                  style={{
                    color: 'white',
                    marginLeft: '10px',
                    backgroundColor: '#388e3c',
                    padding: '3px 5px',
                  }}
                >
                  In Stock
                </span>
              ) : (
                <span
                  style={{
                    color: 'white',
                    marginLeft: '10px',
                    backgroundColor: '#c62828',
                    padding: '3px 5px',
                  }}
                >
                  Out of stock
                </span>
              )}
            </p>
            <Link
              className={classes.link}
              to={
                item.category
                  ? `/category/${item.category.slug}`
                  : `/pageNotFound`
              }
            >
              <Tooltip placement="left-end" title="View Category">
                <p style={{ color: 'gray' }}>
                  Category:
                  <span
                    style={{
                      color: 'black',
                      marginLeft: '10px',
                    }}
                  >
                    {item.category ? item.category.name : 'Category not found'}
                  </span>
                </p>
              </Tooltip>
            </Link>
          </Typography>
        </CardContent>
      </div>

      <Tooltip placement="left-start" title="Add product to your cart">
        <Button
          onClick={handleAddToCart}
          size="small"
          disabled={item.quantity < 1}
          startIcon={<ShoppingCartIcon />}
          className={classes.button}
          variant="contained"
        >
          Add to Cart
        </Button>
      </Tooltip>
    </Card>
  )
}