import React, { useState } from 'react'
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListSubheader,
} from '@material-ui/core'
import { Menu } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import HomeIcon from '@material-ui/icons/Home'
import ShopIcon from '@material-ui/icons/Shop'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import { NavLink } from 'react-router-dom'

const useStyles = makeStyles({
  list: {
    width: 150,
  },
  listIcon: {
    marginRight: '10px',
  },
  link: {
    textDecoration: 'none',
    color: 'black',
  },
})

const SideNav = () => {
  const classes = useStyles()

  const [state, setState] = useState({ left: false })

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
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List component='nav'>
        <ListSubheader component='div' id='nested-list-subheader'>
          Menu
        </ListSubheader>

        <NavLink
          exact='true'
          activeStyle={{
            color: '#0277bd',
            backgroundColor: '#e1f5fe',
          }}
          to='/'
          className={classes.link}
        >
          <ListItem button>
            <HomeIcon className={classes.listIcon}></HomeIcon>
            <span>Home</span>
          </ListItem>
        </NavLink>

        <NavLink
          activeStyle={{
            color: '#0277bd',
            backgroundColor: '#e1f5fe',
          }}
          to='/shop'
          className={classes.link}
        >
          <ListItem button>
            <ShopIcon className={classes.listIcon}></ShopIcon>
            <span>Shop</span>
          </ListItem>
        </NavLink>

        <NavLink
          activeStyle={{
            color: '#0277bd',
            backgroundColor: '#e1f5fe',
          }}
          to='/cart'
          className={classes.link}
        >
          <ListItem button>
            <ShoppingCartIcon className={classes.listIcon}></ShoppingCartIcon>
            <span>Cart</span>
          </ListItem>
        </NavLink>
      </List>
    </div>
  )

  return (
    <>
      <IconButton
        edge='start'
        aria-label='menu'
        onClick={toggleDrawer('left', true)}
      >
        <Menu />
      </IconButton>
      <Drawer
        anchor='left'
        open={state.left}
        onOpen={toggleDrawer('left', true)}
        onClose={toggleDrawer('left', false)}
      >
        {sideDrawerList('left')}
      </Drawer>
    </>
  )
}

export default SideNav
