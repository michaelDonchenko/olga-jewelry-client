import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import React from 'react'
import { NavLink } from 'react-router-dom'
import firebase from 'firebase'
import { LOGOUT } from '../../types/userTypes'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    color: 'white',
    padding: '2px',
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    flexWrap: 'wrap',
    backgroundColor: '#607d8b',
    color: 'white',
  },
})

const AdminNav = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const logoutHandler = () => {
    firebase.auth().signOut()
    dispatch({
      type: LOGOUT,
      payload: null,
    })
    localStorage.removeItem('userInfo')
  }

  return (
    <List className={classes.flexContainer}>
      <NavLink className={classes.link} to='/admin/dashboard'>
        <ListItem button>
          <ListItemText primary='Orders' />
        </ListItem>
      </NavLink>

      <NavLink className={classes.link} to='/admin/categories'>
        <ListItem button>
          <ListItemText primary='Categories' />
        </ListItem>
      </NavLink>

      <NavLink className={classes.link} to='/admin/product'>
        <ListItem button>
          <ListItemText primary='Create product' />
        </ListItem>
      </NavLink>
      <NavLink className={classes.link} to='/admin/products'>
        <ListItem button>
          <ListItemText primary='All products' />
        </ListItem>
      </NavLink>

      <ListItem
        onClick={logoutHandler}
        style={{ width: 'auto', marginLeft: 'auto' }}
        button
      >
        <ListItemIcon style={{ minWidth: '30px', color: 'white' }}>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary='Logout' />
      </ListItem>
    </List>
  )
}

export default AdminNav
