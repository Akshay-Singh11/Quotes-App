import React, { Fragment } from 'react'
import MainNavigation from './components/mainNavigation/mainNavigation'
import { Route, Routes } from 'react-router-dom'
import AllQuotes from './components/pages/AllQuotes'
import NewQuotes from './components/pages/NewQuotes'
import ShowQuotes from './components/pages/ShowQuotes'

function App() {
  return (
    <Fragment>
      <MainNavigation />
      <Routes>
        <Route path='/' element={<AllQuotes />} />
        <Route path='/new' element={<NewQuotes />} />
        <Route path='/quotes/:id' element={<ShowQuotes />} />
      </Routes>
    </Fragment>
  )
}

export default App