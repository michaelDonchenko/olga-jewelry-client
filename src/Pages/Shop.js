import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listCategories } from '../controllers/categoryControllers'
import { makeStyles } from '@material-ui/core'
import { getProducts } from '../controllers/productControllers'
import HomeCard from '../components/HomeCard'
import { Pagination, PaginationItem } from '@material-ui/lab'

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
})

const Shop = ({ match }) => {
  const classes = useStyles()

  const pageNumber = match.params.pageNumber || 1

  const [state, setState] = useState({
    loading: '',
    error: '',
    categories: '',
    products: [],
    page: '',
    pages: '',
    pageSize: '',
    sort: '',
    order: '',
    filter: {},
  })

  const {
    loading,
    error,
    categories,
    products,
    page,
    pages,
    pageSize,
    filter,
    sort,
    order,
  } = state

  const onLoad = async () => {
    setState({ ...state, loading: true })
    try {
      const categories = await listCategories()
      const res = await getProducts(pageNumber, 8, sort, order)
      setState({
        ...state,
        loading: false,
        categories: categories.data,
        products: res.data.products,
        page: res.data.page,
        pages: res.data.pages,
        pageSize: res.data.pageSize,
      })
    } catch (error) {
      console.log(error)
      setState({ ...state, loading: false, error: error.response.data.error })
    }
  }

  useEffect(() => {
    onLoad()
  }, [pageNumber, sort, order])

  const handleFilterChange = (e) => {
    setState({
      ...state,
      sort: e.target.value.sort,
      order: e.target.value.order,
    })
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Shop</h1>
      <h2
        style={{
          textAlign: 'center',
          color: 'black',
          backgroundColor: '#fafafa',
        }}
      >
        Categories and Filters
      </h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h4 style={{ display: 'inline', margin: '8px 15px 0 15px' }}>
          {' '}
          Filter products:
        </h4>
        <FormControl style={{ margin: ' 0 15px', width: '300px' }}>
          <InputLabel id="filters">Choose filter</InputLabel>
          <Select
            labelId="filters"
            id="filters"
            onChange={handleFilterChange}
            defaultValue=""
          >
            <MenuItem value={{ sort: 'createdAt', order: -1 }}>
              Default: From newest to oldest
            </MenuItem>
            <MenuItem value={{ sort: 'price', order: -1 }}>
              Price: from highest to lowest
            </MenuItem>
            <MenuItem value={{ sort: 'price', order: 1 }}>
              Price: from lowest to highest
            </MenuItem>

            {/* <MenuItem value={{ sort: 'sold', order: '-1' }}>
              Most popular products
            </MenuItem> */}
            <MenuItem value={{ sort: 'sold', order: -1 }}>
              Best sellers
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <div style={{ margin: '20px 0' }} className={classes.flexContainer}>
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
          backgroundColor: '#fafafa',
        }}
      >
        Products
      </h2>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          products.map((p, i) => <HomeCard key={i} item={p} />)
        )}
      </div>
      <div
        style={{
          marginBottom: '50px',
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
                to={`/shop/${item.page}`}
                {...item}
              />
            )}
          />
        )}
      </div>
    </div>
  )
}

export default Shop
