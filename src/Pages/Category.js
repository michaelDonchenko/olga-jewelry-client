import { Button, CircularProgress } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import HomeCard from '../components/HomeCard'
import { readCategory } from '../controllers/categoryControllers'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import { Pagination, PaginationItem } from '@material-ui/lab'

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    display: 'block',
    color: 'Graytext',
  },
})

const Category = ({ match, history }) => {
  const classes = useStyles()
  const slug = match.params.slug
  const pageNumber = match.params.pageNumber || 1

  const [state, setState] = useState({
    loading: '',
    error: '',
    category: '',
    products: [],
    page: '',
    pages: '',
    pageSize: '',
  })

  const { loading, error, category, products, page, pages, pageSize } = state

  const goBackHandler = () => {
    history.push('/shop')
  }

  const getCategory = async () => {
    setState({ ...state, loading: true })
    try {
      const { data } = await readCategory(slug, pageNumber, 8)
      setState({
        ...state,
        loading: false,
        category: data.category,
        products: data.products,
        page: data.page,
        pages: data.pages,
        pageSize: data.pageSize,
      })
    } catch (error) {
      setState({ ...state, error: error.response.data.error, loading: false })
      console.log(error)
    }
  }

  useEffect(() => {
    getCategory()
  }, [pageNumber])

  return (
    <div>
      <Link className={classes.link} onClick={goBackHandler}>
        <Button variant="contained" style={{ margin: '15px 0' }}>
          Go to Shop
        </Button>
      </Link>

      {loading && (
        <div style={{ textAlign: 'center', margin: '15px 0' }}>
          <CircularProgress />
        </div>
      )}
      {category && <h1 style={{ textAlign: 'center' }}>{category.name}</h1>}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          margin: '15px',
        }}
      >
        {products &&
          products.length >= 1 &&
          products.map((p, i) => (
            <div style={{ margin: '15px' }}>
              <HomeCard key={i} item={p} />
            </div>
          ))}
      </div>

      {products && products.length < 1 && (
        <h3>We are sorry there are no products yet.</h3>
      )}
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
                to={`/category/${category.slug}/${item.page}`}
                {...item}
              />
            )}
          />
        )}
      </div>
    </div>
  )
}

export default Category
