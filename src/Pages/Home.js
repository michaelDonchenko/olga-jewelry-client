import React, { useState, useEffect } from 'react'
import { listProducts } from '../controllers/productControllers'
import Carousel from 'react-material-ui-carousel'
import {
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  List,
  Paper,
  TextField,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { NavLink, Link } from 'react-router-dom'
import { listCategories } from '../controllers/categoryControllers'
import logo from '../public/logo.png'

const useStyles = makeStyles({
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: '15px 0',
  },
  link: {
    textDecoration: 'none',
    display: 'block',
  },
  iconDiv: {
    fontSize: '40px',
    margin: '10px',
  },

  myIcons: {
    color: '#424242',
  },

  img: {
    '&:hover': {
      boxShadow:
        'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    },
  },
})

const Home = () => {
  const [state, setState] = useState({
    newArrivals: [],
    bestSellers: [],
    loading: '',
    error: '',
    categories: '',
  })

  const newArivalsValues = {
    sort: 'createdAt',
    order: -1,
    limit: 4,
  }

  const bestSellersValues = {
    sort: 'sold',
    order: -1,
    limit: 4,
  }

  const { newArrivals, bestSellers, loading, error, categories } = state

  const classes = useStyles()

  const getProducts = async () => {
    setState({ ...state, loading: true })
    try {
      const newProducts = await listProducts(newArivalsValues)
      const bestSellers = await listProducts(bestSellersValues)
      const categories = await listCategories()
      setState({
        ...state,
        newArrivals: newProducts.data,
        bestSellers: bestSellers.data,
        categories: categories.data,
        loading: false,
      })
    } catch (error) {
      console.log(error)
      setState({ ...state, loading: false, error: error.response.data.error })
    }
  }

  useEffect(() => getProducts(), [])

  return (
    <>
      <Grid container direction='row'>
        <Grid style={{ margin: '10px' }} item md={2} xs={12}>
          <img style={{ height: '60px' }} src={logo} />
        </Grid>
        <Grid style={{ margin: '10px' }} item md={8} xs={12}>
          <Button>Categories</Button> <Button>Contact us</Button>
          <Button>About</Button>
        </Grid>
      </Grid>
      <Container maxWidth='md' style={{ marginBottom: '100px' }}>
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
        <h1
          style={{
            textAlign: 'center',
            color: 'black',
            fontSize: '30px',
            backgroundColor: '#fafafa',
          }}
        >
          New Arrivals
        </h1>
        {loading ? (
          <div style={{ textAlign: 'center', margin: '15px 0' }}>
            <CircularProgress color='black' />
          </div>
        ) : (
          <Carousel interval={8000} timeout={800}>
            {newArrivals &&
              newArrivals.map((item, i) => (
                <Paper style={{ textAlign: 'center' }} key={i}>
                  <h2>{item.name}</h2>
                  <Link className={classes.link} to={`/product/${item._id}`}>
                    <img
                      className={classes.img}
                      style={{ maxHeight: '350px', maxWidth: '100%' }}
                      src={item.images[0]}
                    />
                  </Link>

                  <Link className={classes.link} to={`/product/${item._id}`}>
                    <Button
                      style={{
                        margin: '15px',
                        backgroundColor: '#e3f2fd',
                        padding: '5px 50px',
                        fontWeight: '600',
                      }}
                      variant='contained'
                    >
                      Check It Out
                    </Button>
                  </Link>
                </Paper>
              ))}
          </Carousel>
        )}

        <h1
          style={{
            textAlign: 'center',
            color: 'black',
            fontSize: '30px',
            backgroundColor: '#fafafa',
          }}
        >
          Best Sellers
        </h1>
        {loading ? (
          <div style={{ textAlign: 'center', margin: '15px 0' }}>
            <CircularProgress color='black' />
          </div>
        ) : (
          <Carousel interval={8000} timeout={800}>
            {bestSellers &&
              bestSellers.map((item, i) => (
                <Paper style={{ textAlign: 'center' }} key={i}>
                  <h2>{item.name}</h2>

                  <Link className={classes.link} to={`/product/${item._id}`}>
                    <img
                      className={classes.img}
                      style={{ maxHeight: '350px', maxWidth: '100%' }}
                      src={item.images[0]}
                    />
                  </Link>

                  <Link className={classes.link} to={`/product/${item._id}`}>
                    <Button
                      style={{
                        margin: '15px',
                        backgroundColor: '#e3f2fd',
                        padding: '5px 50px',
                        fontWeight: '600',
                      }}
                      variant='contained'
                    >
                      Check It Out
                    </Button>
                  </Link>
                </Paper>
              ))}
          </Carousel>
        )}
        <h1
          style={{
            textAlign: 'center',
            color: 'black',
            fontSize: '30px',
            backgroundColor: '#fafafa',
          }}
        >
          Categories
        </h1>
        <div style={{ margin: '50px 0' }} className={classes.flexContainer}>
          {loading ? (
            <CircularProgress />
          ) : (
            categories &&
            categories.map((c, i) => (
              <Link
                style={{ margin: '10px' }}
                key={i}
                className={classes.link}
                to={`/category/${c.slug}`}
              >
                <Button
                  style={{
                    color: 'GrayText',
                    fontSize: '18px',
                  }}
                >
                  {c.name}
                </Button>
              </Link>
            ))
          )}
        </div>

        <h2
          style={{
            textAlign: 'center',
            color: 'black',
            fontSize: '30px',
            backgroundColor: '#fafafa',
          }}
        >
          Contact Us
        </h2>
        <div>
          <Grid container>
            <Grid md={6} xs={12} item>
              <h3 style={{ textAlign: 'center' }}>Social Media</h3>
              <div
                className='my-3'
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <div className={classes.iconDiv}>
                  <a
                    target='_blank'
                    href='https://www.instagram.com/odartshop/'
                    className={classes.myIcons}
                  >
                    <i className='fab fa-instagram '></i>
                  </a>
                </div>

                <div className={classes.iconDiv}>
                  <a
                    target='_blank'
                    href='https://www.facebook.com/Olga.Don.art'
                    className={classes.myIcons}
                  >
                    <i className='fab fa-facebook-square '></i>
                  </a>
                </div>
                <div className={classes.iconDiv}>
                  <i class='fab fa-whatsapp'></i>
                </div>
                <span>054-665-9069</span>
              </div>
            </Grid>
            <Grid md={6} xs={12} item>
              <h3 style={{ textAlign: 'center' }}>Send a Message</h3>
              <form>
                <Paper
                  elevation={3}
                  style={{ padding: '15px', maxWidth: '400px', margin: 'auto' }}
                >
                  <TextField
                    onChange={''}
                    style={{ margin: '15px 0' }}
                    name='email'
                    value={''}
                    label='Email'
                    fullWidth
                    helperText='Enter diffrent email if you want to'
                    type='text'
                    required
                  ></TextField>
                  <TextField
                    onChange={''}
                    style={{ margin: '15px 0' }}
                    name='subject'
                    value={''}
                    label='Subject'
                    fullWidth
                    helperText='Type your subject'
                    type='text'
                    required
                  ></TextField>

                  <TextField
                    onChange={''}
                    style={{ margin: '15px 0' }}
                    name='message'
                    value={''}
                    label='Message'
                    multiline
                    rows={3}
                    fullWidth
                    type='text'
                    helperText='Type your message'
                    required
                  ></TextField>

                  <Button
                    onClick={''}
                    type='submit'
                    style={{
                      backgroundColor: '#0d47a1',
                      color: 'white',
                      margin: '15px 0',
                      padding: '5px 15px',
                    }}
                  >
                    Send Message
                  </Button>
                </Paper>
              </form>
            </Grid>
          </Grid>
        </div>

        <h2
          style={{
            textAlign: 'center',
            color: 'black',
            fontSize: '30px',
            backgroundColor: '#fafafa',
          }}
        >
          About and Policy rules
        </h2>
      </Container>
    </>
  )
}

export default Home
