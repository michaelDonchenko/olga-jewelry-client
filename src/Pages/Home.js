import React, { useState, useEffect } from 'react'
import { listProducts } from '../controllers/productControllers'
import { Button, CircularProgress, Container, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Link } from 'react-router-dom'
import { listCategories } from '../controllers/categoryControllers'
import logo from '../public/logo.png'
import HomeCard from '../components/HomeCard'
import ContactUs from '../components/ContactUs'
import { Link as ScrollLink } from 'react-scroll'
import ShopIcon from '@material-ui/icons/Shop'
import { readRules } from '../controllers/userControllers'
import parse from 'html-react-parser'
import { useSelector } from 'react-redux'

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
  },
  button: {
    color: 'white',
    backgroundColor: 'black',
    margin: '10px',

    '&:hover': {
      color: '#e3f2fd',
      backgroundColor: 'black',
    },
  },
})

const Home = () => {
  const user = useSelector((state) => state.user)

  const [state, setState] = useState({
    newArrivals: [],
    loading: '',
    error: '',
    categories: '',
    siteRules: '',
  })

  const newArivalsValues = {
    sort: 'createdAt',
    order: -1,
    limit: 3,
  }

  const { newArrivals, loading, error, categories, siteRules } = state

  const classes = useStyles()

  const getProducts = async () => {
    setState({ ...state, loading: true })
    try {
      const newProducts = await listProducts(newArivalsValues)
      const categories = await listCategories()
      const rules = await readRules()
      setState({
        ...state,
        newArrivals: newProducts.data,
        categories: categories.data,
        siteRules: rules.data.rule,
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
      <Grid container direction="row">
        <Grid style={{ margin: '10px 0' }} item md={2} xs={12}>
          <img style={{ height: '60px' }} src={logo} />
        </Grid>
        <Grid style={{ margin: '10px' }} item md={8} xs={12}>
          <ScrollLink
            offset={-80}
            to="categories"
            spy={true}
            smooth={true}
            duration={1000}
          >
            <Button>Categories</Button>
          </ScrollLink>

          <ScrollLink
            offset={-80}
            to="contactUs"
            spy={true}
            smooth={true}
            duration={1000}
          >
            <Button>Contact us</Button>
          </ScrollLink>
          <ScrollLink
            offset={-80}
            to="about"
            spy={true}
            smooth={true}
            duration={1000}
          >
            <Button>About</Button>
          </ScrollLink>

          <Link className={classes.link} to="/shop">
            <Button
              startIcon={<ShopIcon />}
              size="small"
              className={classes.button}
              variant="contained"
            >
              Go To Shop
            </Button>
          </Link>
        </Grid>
      </Grid>
      {user ? (
        <h3 style={{ textAlign: 'center', margin: '20px 0 30px 0' }}>
          Hello {user.email} , welcome back.
        </h3>
      ) : (
        <h3 style={{ textAlign: 'center', margin: '20px 0 40px 0' }}>
          Hello guest, click{' '}
          <Link className={classes.link} to="/login">
            here
          </Link>{' '}
          to log-in.
        </h3>
      )}
      <Container maxWidth="md" style={{ marginBottom: '100px' }}>
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
            <CircularProgress />
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {newArrivals &&
              newArrivals.map((item, i) => <HomeCard key={i} item={item} />)}
          </div>
        )}

        <h1
          id="categories"
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
          id="contactUs"
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
          <ContactUs />
        </div>

        <h2
          id="about"
          style={{
            textAlign: 'center',
            color: 'black',
            fontSize: '30px',
            backgroundColor: '#fafafa',
            marginBottom: '20px',
          }}
        >
          About and Policy rules
        </h2>
        <div>{siteRules && !loading && parse(siteRules)}</div>
      </Container>
    </>
  )
}

export default Home
