import { useState } from 'react'
import LandingPage  from './pages/LandingPage'
import { RouterProvider } from 'react-router-dom'
import AppRouter from './Routing/AppRouter.jsx'

function App() {

  return (
 <RouterProvider router={AppRouter}/>
  )
}

export default App
