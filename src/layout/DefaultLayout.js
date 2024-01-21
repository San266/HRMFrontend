import React from 'react'
import {AppSidebar, AppFooter, AppHeader } from '../components/index'
import Analytics from 'src/views/pages/Analytics/Analytics'
const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <Analytics></Analytics>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
