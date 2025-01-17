import React from 'react'
import { Outlet } from 'react-router-dom'
import { NavigationBar } from './components/NavigationBar'

export const App = () => {
  return (
    <>
      <NavigationBar />
      <div className="p-14">
        <Outlet />
      </div>
    </>
  )
}
