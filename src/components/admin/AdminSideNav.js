import React, { useState } from 'react'
import {
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@material-ui/core'
import { Menu } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { NavLink } from 'react-router-dom'
import firebase from 'firebase'
import { LOGOUT } from '../../types/userTypes'
import { useDispatch } from 'react-redux'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

const useStyles = makeStyles({
  list: {
    width: 180,
  },
  listIcon: {
    marginRight: '10px',
  },
  link: {
    textDecoration: 'none',
    color: 'black',
  },
})

const AdminSideNav = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [state, setState] = useState({ left: false })

  const logoutHandler = async () => {
    await firebase.auth().signOut()
    dispatch({
      type: LOGOUT,
      payload: null,
    })
    localStorage.removeItem('userInfo')
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    setState({ [anchor]: open })
  }

  const sideDrawerList = (anchor) => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListSubheader component="div" id="nested-list-subheader">
          Menu
        </ListSubheader>
        <NavLink className={classes.link} to="/admin/dashboard">
          <ListItem button>
            <ListItemText primary="Orders" />
          </ListItem>
        </NavLink>

        <NavLink className={classes.link} to="/admin/categories">
          <ListItem button>
            <ListItemText primary="Categories" />
          </ListItem>
        </NavLink>

        <NavLink className={classes.link} to="/admin/product">
          <ListItem button>
            <ListItemText primary="Create product" />
          </ListItem>
        </NavLink>
        <NavLink className={classes.link} to="/admin/products">
          <ListItem button>
            <ListItemText primary="All products" />
          </ListItem>
        </NavLink>

        <NavLink className={classes.link} to="/admin/edit">
          <ListItem button>
            <ListItemText primary="Site Rules" />
          </ListItem>
        </NavLink>

        <ListItem onClick={logoutHandler} style={{ width: 'auto' }} button>
          <ListItemIcon style={{ minWidth: '30px' }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  )

  return (
    <>
      <Button
        fullWidth
        startIcon={<Menu style={{ color: 'white' }} />}
        style={{ backgroundColor: '#607d8b', color: 'white' }}
        variant="contained"
        aria-label="menu"
        onClick={toggleDrawer('left', true)}
      >
        Admin Menu
      </Button>
      <Drawer
        anchor="left"
        open={state.left}
        onOpen={toggleDrawer('left', true)}
        onClose={toggleDrawer('left', false)}
      >
        {sideDrawerList('left')}
      </Drawer>
    </>
  )
}

export default AdminSideNav
