import React, { Component, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './scss/style.scss'

import Landing from './views/landing/Landing'
import AuthIndex from './views/auth_pages/Auth'
import PagesIndex from './views/pages/Path'

class App extends Component {
  render() {
    return (
      <Router basename="/">
        <Route path='/' exact component={Landing} />
        <Route path='/auth'  component={AuthIndex} />
        <Route path='/pages'  component={PagesIndex} />
      </Router>
    )
  }
}

export default App
