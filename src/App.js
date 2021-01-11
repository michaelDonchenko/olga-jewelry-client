import { Container } from '@material-ui/core'
import React, { useEffect } from 'react'
import NavBar from './components/NavBar'
import { Switch, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/authPages/Login'
import Register from './Pages/authPages/Register'
import Shop from './Pages/Shop'
import Cart from './Pages/Cart'
import RegisterComplete from './Pages/authPages/RegisterComplete'
import PrivateRoute from './components/routes/PrivateRoute'
import UserProfile from './Pages/userPages/UserProfile'
import PurchaseHistory from './Pages/userPages/PurchaseHistory'
import AdminRoute from './components/routes/AdminRoute'
import AdminDashboard from './Pages/adminPages/AdminDashboard'
import AdminCategories from './Pages/adminPages/AdminCategories'
import CreateProduct from './Pages/adminPages/CreateProduct'
import AdminProducts from './Pages/adminPages/AdminProducts'
import UpdateProduct from './Pages/adminPages/UpdateProduct'
import firebase from 'firebase'
import { useDispatch, useSelector } from 'react-redux'
import { REFRESH_TOKEN } from './types/userTypes'
import Product from './Pages/Product'
import Category from './Pages/Category'
import Checkout from './Pages/Checkout'
import OrderSuccess from './Pages/OrderSuccess'

const App = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      return firebase.auth().onIdTokenChanged(async (firebaseUser) => {
        if (!firebaseUser) {
          console.log('No firebase user looged in')
          return
        } else {
          return (
            localStorage.setItem(
              'userInfo',
              JSON.stringify({
                email: user.email,
                token: firebaseUser.ya,
                role: user.role,
                id: user.id,
              })
            ),
            dispatch({
              type: REFRESH_TOKEN,
              payload: {
                email: user.email,
                token: firebaseUser.ya,
                role: user.role,
                id: user.id,
              },
            }),
            console.log('token set')
          )
        }
      })
    }
  }, [])

  // force refresh the token every 30 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const firebaseUser = await firebase.auth().currentUser
      if (firebaseUser) {
        console.log('forced refresh')
        return await firebaseUser.getIdToken(true)
      }
    }, 60000 * 10)

    // clean up setInterval
    return () => clearInterval(handle)
  }, [])

  return (
    <>
      <NavBar />

      <Container>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/register/complete" component={RegisterComplete} />
          <Route exact path="/shop" component={Shop} />
          <Route exact path="/shop/:pageNumber" component={Shop} />
          <Route exact path="/product/:id" component={Product} />
          <Route exact path="/category/:slug" component={Category} />
          <Route
            exact
            path="/category/:slug/:pageNumber"
            component={Category}
          />
          <Route exact path="/cart" component={Cart} />
          <PrivateRoute exact path="/checkout" component={Checkout} />
          <PrivateRoute
            exact
            path="/order-success/:id"
            component={OrderSuccess}
          />
          <PrivateRoute exact path="/user/profile" component={UserProfile} />
          <PrivateRoute
            exact
            path="/user/history"
            component={PurchaseHistory}
          />
          <AdminRoute
            exact
            path="/admin/dashboard"
            component={AdminDashboard}
          />
          <AdminRoute
            exact
            path="/admin/categories"
            component={AdminCategories}
          />
          <AdminRoute exact path="/admin/product" component={CreateProduct} />
          <AdminRoute
            exact
            path="/admin/product/:id"
            component={UpdateProduct}
          />
          <AdminRoute exact path="/admin/products" component={AdminProducts} />
          <AdminRoute
            exact
            path="/admin/products/:pageNumber"
            component={AdminProducts}
          />
        </Switch>
      </Container>
    </>
  )
}

export default App
