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
import { useDispatch } from 'react-redux'
import { REFRESH_TOKEN } from './types/userTypes'
import Product from './Pages/Product'
import Category from './Pages/Category'
import Checkout from './Pages/Checkout'
import OrderSuccess from './Pages/OrderSuccess'
import UserOrderPage from './Pages/UserOrderPage'
import ForgotPassword from './Pages/authPages/ForgotPassword'
import AdminOrder from './Pages/adminPages/AdminOrder'
import Comments from './Pages/adminPages/Comments'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    firebase.auth().onIdTokenChanged(async () => {
      const firebaseUser = await firebase.auth().currentUser
      let user = await JSON.parse(localStorage.getItem('userInfo'))
      if (firebaseUser && user) {
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
          console.log('Token Set')
        )
      }
    })
  }, [])

  // force refresh the token every 20 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const firebaseUser = await firebase.auth().currentUser
      let user = await JSON.parse(localStorage.getItem('userInfo'))
      // console.log('User:', user, 'FirebaseUser:', firebaseUser)
      if (firebaseUser && user) {
        console.log('forced refresh')
        return await firebaseUser.getIdToken(true)
      }
      console.log('Did not force refresh')
    }, 60000 * 20)

    // clean up setInterval
    return () => clearInterval(handle)
  })

  return (
    <>
      <NavBar />

      <Container>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/register/complete" component={RegisterComplete} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
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
          <PrivateRoute
            exact
            path="/user/history/:pageNumber"
            component={PurchaseHistory}
          />
          <PrivateRoute
            exact
            path="/user/order/:id"
            component={UserOrderPage}
          />
          <AdminRoute
            exact
            path="/admin/dashboard"
            component={AdminDashboard}
          />

          <AdminRoute
            exact
            path="/admin/dashboard/:pageNumber"
            component={AdminDashboard}
          />
          <AdminRoute exact path="/admin/order/:id" component={AdminOrder} />
          <AdminRoute exact path="/admin/comments" component={Comments} />
          <AdminRoute
            exact
            path="/admin/comments/:pageNumber"
            component={Comments}
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
