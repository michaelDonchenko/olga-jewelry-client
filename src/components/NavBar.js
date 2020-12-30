import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import HomeIcon from '@material-ui/icons/Home'
import { Container, Menu, MenuItem, Tooltip } from '@material-ui/core'
import ShopIcon from '@material-ui/icons/Shop'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import SideNav from './SideNav'
import { Hidden } from '@material-ui/core'
import { NavLink, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import HistoryIcon from '@material-ui/icons/History'
import PersonIcon from '@material-ui/icons/Person'
import firebase from 'firebase'
import { LOGOUT } from '../types/userTypes'
import DashboardIcon from '@material-ui/icons/Dashboard'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    padding: 0,
    backgroundColor: '#fafafa',
  },

  link: {
    textDecoration: 'none',
    color: 'black',
    padding: '2px',
  },

  title: {
    flexGrow: 1,
  },
  navIcon: { fontSize: '1.6rem' },
  menuIcon: { marginRight: '7px' },
  activeLink: { color: '#0277bd' },
}))

const NavBar = () => {
  const classes = useStyles()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const logoutHandler = () => {
    firebase.auth().signOut()
    dispatch({
      type: LOGOUT,
      payload: null,
    })
    localStorage.removeItem('userInfo')
  }

  return (
    <AppBar position='sticky' className={classes.root}>
      <Container maxWidth={'lg'} style={{ padding: '0' }}>
        <Toolbar>
          <Typography className={classes.title}>
            <Hidden smUp>
              <SideNav />
            </Hidden>

            <Hidden xsDown>
              <Tooltip placement='bottom-start' title='Home'>
                <NavLink
                  exact={true}
                  activeStyle={{
                    color: '#0277bd',
                    backgroundColor: '#e1f5fe',
                    padding: '10px 0 12px 0',
                  }}
                  to='/'
                  className={classes.link}
                >
                  <Button color='inherit'>
                    <HomeIcon className={classes.navIcon}></HomeIcon>
                  </Button>
                </NavLink>
              </Tooltip>

              <Tooltip placement='bottom-start' title='Shop'>
                <NavLink
                  activeStyle={{
                    color: '#0277bd',
                    backgroundColor: '#e1f5fe',
                    padding: '10px 0 12px 0',
                  }}
                  to='/shop'
                  className={classes.link}
                >
                  <Button color='inherit'>
                    <ShopIcon className={classes.navIcon}></ShopIcon>
                  </Button>
                </NavLink>
              </Tooltip>

              <Tooltip placement='bottom-start' title='Cart'>
                <NavLink
                  activeStyle={{
                    color: '#0277bd',
                    backgroundColor: '#e1f5fe',
                    padding: '10px 0 12px 0',
                  }}
                  to='/cart'
                  className={classes.link}
                >
                  <Button color='inherit'>
                    <ShoppingCartIcon
                      className={classes.navIcon}
                    ></ShoppingCartIcon>
                  </Button>
                </NavLink>
              </Tooltip>
            </Hidden>
          </Typography>

          {!user && (
            <>
              <NavLink
                activeStyle={{
                  color: '#0277bd',
                  backgroundColor: '#e1f5fe',
                }}
                to='/login'
                className={classes.link}
              >
                <Button color='inherit'>
                  <span>Login</span>
                </Button>
              </NavLink>

              <NavLink
                activeStyle={{
                  color: '#0277bd',
                  backgroundColor: '#e1f5fe',
                }}
                to='/register'
                className={classes.link}
              >
                <Button color='inherit'>
                  <span>Register</span>
                </Button>
              </NavLink>
            </>
          )}
          {user && user.role === 'subscriber' && (
            <Tooltip
              placement='bottom-start'
              title={`menu for user ${user.email}`}
            >
              <Button
                aria-controls='simple-menu'
                aria-haspopup='true'
                onClick={handleClick}
                startIcon={<AccountCircleIcon style={{ fontSize: '1.5rem' }} />}
                className={classes.link}
                color='inherit'
              >
                <span>User Menu</span>
              </Button>
            </Tooltip>
          )}

          {user && user.role === 'admin' && (
            <NavLink
              style={{ padding: '5px' }}
              activeStyle={{
                color: '#0277bd',
                backgroundColor: '#e1f5fe',
              }}
              to='/admin/dashboard'
              className={classes.link}
            >
              <Button
                startIcon={<DashboardIcon />}
                className={classes.link}
                color='inherit'
              >
                <span>Admin Dashboard</span>
              </Button>
            </NavLink>
          )}
        </Toolbar>

        <Menu
          id='simple-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <NavLink
            activeStyle={{
              color: '#0277bd',
              backgroundColor: '#e1f5fe',
            }}
            className={classes.link}
            to='/user/profile'
          >
            <MenuItem onClick={handleClose}>
              <PersonIcon className={classes.menuIcon} /> Profile
            </MenuItem>
          </NavLink>

          <NavLink
            activeStyle={{
              color: '#0277bd',
              backgroundColor: '#e1f5fe',
            }}
            className={classes.link}
            to='/user/history'
          >
            <MenuItem onClick={handleClose}>
              <HistoryIcon className={classes.menuIcon} /> Purchase history
            </MenuItem>
          </NavLink>

          <Link onClick={logoutHandler} className={classes.link}>
            <MenuItem onClick={handleClose}>
              <ExitToAppIcon className={classes.menuIcon} /> Logout
            </MenuItem>
          </Link>
        </Menu>
      </Container>
    </AppBar>
  )
}

export default NavBar
