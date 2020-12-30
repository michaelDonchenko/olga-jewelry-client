import { Hidden } from '@material-ui/core'
import React from 'react'
import AdminNav from '../../components/admin/AdminNav'
import AdminSideNav from '../../components/admin/AdminSideNav'

const AdminDashboard = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '30px 0' }}>Admin Dashboard</h1>

      <Hidden smDown>
        <AdminNav />
      </Hidden>

      <Hidden mdUp>
        <AdminSideNav />
      </Hidden>

      <h2 style={{ textAlign: 'center', margin: '30px 0' }}>Orders</h2>
    </div>
  )
}

export default AdminDashboard
