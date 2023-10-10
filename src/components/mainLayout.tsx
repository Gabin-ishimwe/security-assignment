import React from 'react'
import toast, { Toaster } from 'react-hot-toast';
const MainLayout = ({children}:any) => {
  return (
    <>
    <Toaster/>
    {children}
    </>
  )
}

export default MainLayout