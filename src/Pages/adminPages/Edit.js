import { Button, CircularProgress, Hidden } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import AdminNav from '../../components/admin/AdminNav'
import AdminSideNav from '../../components/admin/AdminSideNav'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { EditRules } from '../../controllers/adminControllers'

const Edit = () => {
  const [value, setValue] = useState('')
  const user = useSelector((state) => state.user)

  const handleSubmit = async () => {
    try {
      await EditRules(value, user.token)
      setValue('')
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center', margin: '30px 0' }}>Admin Dashboard</h1>

      <Hidden smDown>
        <AdminNav />
      </Hidden>

      <Hidden mdUp>
        <AdminSideNav />
      </Hidden>

      <div>
        <h2 style={{ textAlign: 'center', margin: '30px 0' }}>Site Rules</h2>
        <CKEditor
          editor={ClassicEditor}
          data={value}
          onChange={(event, editor) => {
            const data = editor.getData()
            setValue(data)
          }}
        />
      </div>
      <Button
        type="submit"
        style={{ margin: '15px 0 30px 0' }}
        onClick={handleSubmit}
        variant="outlined"
      >
        Save
      </Button>
    </div>
  )
}

export default Edit
