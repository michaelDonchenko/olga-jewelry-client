import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { Button, Tooltip } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { makeStyles } from '@material-ui/core'
import { REMOVE_FROM_CART, ADD_TO_CART } from '../types/cartTypes'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles({
  deleteButton: {
    backgroundColor: '#d50000',
    color: 'white',
    '&:hover': { backgroundColor: '#f44336', color: 'white' },
  },
})

const CartTable = ({ cart }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const handleRemove = (id) => {
    let cart = []

    if (typeof window !== 'undefined') {
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }

      cart.map((product, i) => {
        if (product._id === id) {
          cart.splice(i, 1)
        }
      })

      localStorage.setItem('cart', JSON.stringify(cart))
      dispatch({
        type: REMOVE_FROM_CART,
        payload: cart,
      })
    }
  }

  return (
    <TableContainer style={{ maxWidth: '95%' }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Image</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Category</TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="center">Count</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {cart.map((p, i) => (
            <TableRow key={i}>
              <TableCell align="center">
                {<img src={p.images[0]} style={{ height: '50px' }} />}
              </TableCell>
              <TableCell align="center">{p.name}</TableCell>
              <TableCell align="center">
                {p.category ? p.category.name : 'Category not found'}
              </TableCell>
              <TableCell align="center">{p.price}₪</TableCell>
              <TableCell align="center">
                <input
                  type="number"
                  value={p.count}
                  onChange={(e) => {
                    let cart = []

                    if (typeof window !== 'undefined') {
                      let count = e.target.value < 1 ? 1 : e.target.value

                      if (count > p.quantity) {
                        return
                      }

                      if (localStorage.getItem('cart')) {
                        cart = JSON.parse(localStorage.getItem('cart'))
                      }

                      cart.map((product, i) => {
                        if (product._id === p._id) cart[i].count = count
                      })

                      localStorage.setItem('cart', JSON.stringify(cart))
                      dispatch({
                        type: ADD_TO_CART,
                        payload: cart,
                      })
                    }
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <Tooltip placement="right-end" title="Remove this Item?">
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    variant="contained"
                    className={classes.deleteButton}
                    onClick={() => handleRemove(p._id)}
                  >
                    Remove
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CartTable
