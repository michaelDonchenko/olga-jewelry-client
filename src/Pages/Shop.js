import { Button, CircularProgress } from '@material-ui/core'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { listCategories } from '../controllers/categoryControllers'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: '15px 0',
  },
})

const Shop = () => {
  const classes = useStyles()

  const [state, setState] = useState({
    loading: '',
    error: '',
    categories: '',
  })

  const { loading, error, categories } = state

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
    </div>
  )
}

export default Shop
